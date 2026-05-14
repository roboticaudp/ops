import { Team, Tutor, Assignment } from '../types';

export interface SolverResult {
  assignments: Assignment[];
  unassignedTeams: string[];
  reason?: string;
}

export class SchedulingRules {
  static MAX_TEAMS_PER_BLOCK = 4;

  static isBlockAtFullCapacity(blockId: string, assignments: Assignment[]): boolean {
    // Optimización: En el solver real esto se manejará con un contador previo
    const teamsInBlock = assignments.filter(a => a.block_id === blockId).length;
    return teamsInBlock >= this.MAX_TEAMS_PER_BLOCK;
  }

  static isTutorAvailable(
    tutor: Tutor, 
    blockId: string, 
    assignments: Assignment[], 
    globalUsage: Map<string, number>,
    tutorCurrentBlocks: Map<string, Set<string>> // Nuevo: para O(1) check
  ): boolean {
    const hasBlockAvailability = tutor.availability.includes(blockId);
    if (!hasBlockAvailability) return false;

    const isBusyInBlock = tutorCurrentBlocks.get(tutor.id)?.has(blockId);
    if (isBusyInBlock) return false;

    const hasReachedWeeklyCapacity = (globalUsage.get(tutor.id) || 0) >= tutor.max_sessions;
    return !hasReachedWeeklyCapacity;
  }
}

class SchedulingSolver {
  private teams: Team[];
  private tutors: Tutor[];
  private teamsMap: Map<string, Team>;
  private tutorGlobalUsage: Map<string, number>;
  private tutorCurrentBlocks: Map<string, Set<string>>;
  private schoolTeamCount: Map<string, number>;
  private blockUsageCount: Map<string, number>;
  
  private bestAssignments: Assignment[] = [];
  private bestScore: number = -1;
  private fixedAssignments: Assignment[] = [];
  private startTime: number = 0;
  private readonly TIME_LIMIT = 5000;

  constructor(teams: Team[], tutors: Tutor[], fixedAssignments: Assignment[] = []) {
    this.teams = teams;
    this.tutors = tutors;
    this.teamsMap = new Map(teams.map(t => [t.id, t]));
    this.fixedAssignments = fixedAssignments.map(a => ({ ...a, is_fixed: true }));
    
    // Inicializar mapas de seguimiento para O(1)
    this.tutorGlobalUsage = new Map();
    this.tutorCurrentBlocks = new Map();
    this.blockUsageCount = new Map();
    
    tutors.forEach(t => {
      this.tutorGlobalUsage.set(t.id, 0);
      this.tutorCurrentBlocks.set(t.id, new Set());
    });

    // Cargar asignaciones fijas en los mapas de estado
    this.fixedAssignments.forEach(a => {
      this.tutorGlobalUsage.set(a.tutor_id, (this.tutorGlobalUsage.get(a.tutor_id) || 0) + 1);
      this.tutorCurrentBlocks.get(a.tutor_id)?.add(a.block_id);
      this.blockUsageCount.set(a.block_id, (this.blockUsageCount.get(a.block_id) || 0) + 1);
    });

    // Calcular equidad escolar inicial
    this.schoolTeamCount = new Map();
    teams.forEach(t => {
      this.schoolTeamCount.set(t.school, (this.schoolTeamCount.get(t.school) || 0) + 1);
    });
  }

  public solve(): SolverResult {
    this.startTime = Date.now();
    
    const fixedTeamIds = new Set(this.fixedAssignments.map(a => a.team_id));
    const teamsToAssign = this.teams.filter(t => !fixedTeamIds.has(t.id));

    const initialSorted = this.sortTeamsByPriority(teamsToAssign);
    this.backtrack(initialSorted, [...this.fixedAssignments]);
    
    // Optimización de equidad mejorada
    this.bestAssignments = this.optimizeEquity(this.bestAssignments);
    
    return this.buildResult();
  }

  private scoreSolution(assignments: Assignment[]): number {
    const schoolsRepresented = new Set<string>();
    
    for (const a of assignments) {
      const team = this.teamsMap.get(a.team_id);
      if (team) schoolsRepresented.add(team.school);
    }

    return assignments.length * 1000 + schoolsRepresented.size;
  }

  private backtrack(remainingTeams: Team[], currentAssignments: Assignment[]): boolean {
    if (Date.now() - this.startTime > this.TIME_LIMIT) return true;

    const currentScore = this.scoreSolution(currentAssignments);
    if (currentScore > this.bestScore) {
      this.bestScore = currentScore;
      this.bestAssignments = [...currentAssignments];
    }

    if (remainingTeams.length === 0) return true;

    const team = remainingTeams[0];
    const nextRemaining = remainingTeams.slice(1);

    // Heurística MRV filtrada por capacidad de bloque (O(1) lookup)
    const validBlocks = team.availability.filter(b => 
      (this.blockUsageCount.get(b) || 0) < SchedulingRules.MAX_TEAMS_PER_BLOCK
    );

    for (const blockId of validBlocks) {
      const eligibleTutors = this.getEligibleTutors(blockId, currentAssignments);
      
      for (const tutor of eligibleTutors) {
        this.applyAssignment(team, tutor, blockId, currentAssignments);
        if (this.backtrack(nextRemaining, currentAssignments)) return true;
        this.undoAssignment(currentAssignments);
      }
    }

    // Rama: Intentar sin este equipo para no bloquear soluciones globales
    if (this.backtrack(nextRemaining, currentAssignments)) return true;

    return false;
  }

  private getEligibleTutors(blockId: string, currentAssignments: Assignment[]): Tutor[] {
    return this.tutors
      .filter(t => SchedulingRules.isTutorAvailable(t, blockId, currentAssignments, this.tutorGlobalUsage, this.tutorCurrentBlocks))
      .sort((a, b) => (this.tutorGlobalUsage.get(a.id) || 0) - (this.tutorGlobalUsage.get(b.id) || 0));
  }

  private sortTeamsByPriority(teams: Team[]): Team[] {
    return [...teams].sort((a, b) => {
      const aLen = a.availability.length;
      const bLen = b.availability.length;
      if (aLen !== bLen) return aLen - bLen;

      const aSchoolCount = this.schoolTeamCount.get(a.school) || 0;
      const bSchoolCount = this.schoolTeamCount.get(b.school) || 0;
      if (aSchoolCount !== bSchoolCount) return aSchoolCount - bSchoolCount;

      return a.name.localeCompare(b.name);
    });
  }

  private applyAssignment(team: Team, tutor: Tutor, blockId: string, assignments: Assignment[]) {
    assignments.push({
      competition_id: team.competition_id,
      team_id: team.id,
      tutor_id: tutor.id,
      block_id: blockId,
      is_fixed: false
    });
    this.tutorGlobalUsage.set(tutor.id, (this.tutorGlobalUsage.get(tutor.id) || 0) + 1);
    this.tutorCurrentBlocks.get(tutor.id)?.add(blockId);
    this.blockUsageCount.set(blockId, (this.blockUsageCount.get(blockId) || 0) + 1);
  }

  private undoAssignment(assignments: Assignment[]) {
    const last = assignments.pop();
    if (last) {
      this.tutorGlobalUsage.set(last.tutor_id, (this.tutorGlobalUsage.get(last.tutor_id) || 0) - 1);
      this.tutorCurrentBlocks.get(last.tutor_id)?.delete(last.block_id);
      this.blockUsageCount.set(last.block_id, (this.blockUsageCount.get(last.block_id) || 0) - 1);
    }
  }

  private buildResult(): SolverResult {
    const assignedIds = new Set(this.bestAssignments.map(a => a.team_id));
    const unassignedNames = this.teams
      .filter(t => !assignedIds.has(t.id))
      .map(t => t.name);

    return {
      assignments: this.bestAssignments,
      unassignedTeams: unassignedNames
    };
  }

  private optimizeEquity(assignments: Assignment[]): Assignment[] {
    let currentAssignments = [...assignments];
    let improved = true;

    while (improved) {
      improved = false;

      const assignedCountBySchool = new Map<string, number>();
      this.teams.forEach(t => assignedCountBySchool.set(t.school, 0));
      
      currentAssignments.forEach(a => {
        const team = this.teamsMap.get(a.team_id);
        if (team) {
          assignedCountBySchool.set(team.school, (assignedCountBySchool.get(team.school) || 0) + 1);
        }
      });

      const assignedIds = new Set(currentAssignments.map(a => a.team_id));
      const unassignedTeams = this.teams.filter(t => !assignedIds.has(t.id));

      let bestSwap: {
        unassignedTeam: Team;
        assignmentToReplace: Assignment;
        schoolDifference: number;
      } | null = null;

      for (const uTeam of unassignedTeams) {
        const uSchoolCount = assignedCountBySchool.get(uTeam.school) || 0;

        for (const blockId of uTeam.availability) {
          const candidates = currentAssignments.filter(a => a.block_id === blockId && !a.is_fixed);

          for (const candidate of candidates) {
            const candidateTeam = this.teamsMap.get(candidate.team_id);
            if (!candidateTeam) continue;

            const cSchoolCount = assignedCountBySchool.get(candidateTeam.school) || 0;
            const difference = cSchoolCount - uSchoolCount;

            if (difference > 1) {
              if (!bestSwap || difference > bestSwap.schoolDifference) {
                bestSwap = {
                  unassignedTeam: uTeam,
                  assignmentToReplace: candidate,
                  schoolDifference: difference
                };
              }
            }
          }
        }
      }

      if (bestSwap) {
        currentAssignments = currentAssignments.filter(a => a !== bestSwap!.assignmentToReplace);
        currentAssignments.push({
          competition_id: bestSwap.unassignedTeam.competition_id,
          team_id: bestSwap.unassignedTeam.id,
          tutor_id: bestSwap.assignmentToReplace.tutor_id,
          block_id: bestSwap.assignmentToReplace.block_id,
          is_fixed: false
        });
        improved = true;
      }
    }

    return currentAssignments;
  }
}

export function solveScheduling(teams: Team[], tutors: Tutor[], fixedAssignments: Assignment[] = []): SolverResult {
  return new SchedulingSolver(teams, tutors, fixedAssignments).solve();
}
