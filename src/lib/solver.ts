import { Team, Tutor, Assignment } from '../types';

export interface SolverResult {
  assignments: Assignment[];
  unassignedTeams: string[];
  reason?: string;
}

export class SchedulingRules {
  static MAX_TEAMS_PER_BLOCK = 4;

  static isBlockAtFullCapacity(blockId: string, assignments: Assignment[]): boolean {
    const teamsInBlock = assignments.filter(a => a.block_id === blockId).length;
    return teamsInBlock >= this.MAX_TEAMS_PER_BLOCK;
  }

  static isTutorAvailable(tutor: Tutor, blockId: string, assignments: Assignment[], globalUsage: Map<string, number>): boolean {
    const hasBlockAvailability = tutor.availability.includes(blockId);
    const isBusyInBlock = assignments.some(a => a.block_id === blockId && a.tutor_id === tutor.id);
    const hasReachedWeeklyCapacity = (globalUsage.get(tutor.id) || 0) >= tutor.max_sessions;

    return hasBlockAvailability && !isBusyInBlock && !hasReachedWeeklyCapacity;
  }
}

class SchedulingSolver {
  private teams: Team[];
  private tutors: Tutor[];
  private tutorGlobalUsage: Map<string, number>;
  private schoolTeamCount: Map<string, number>;
  
  private bestAssignments: Assignment[] = [];
  private bestScore: number = -1;
  private fixedAssignments: Assignment[] = [];
  private startTime: number = 0;
  private readonly TIME_LIMIT = 5000; // 5 seconds limit for browser safety

  constructor(teams: Team[], tutors: Tutor[], fixedAssignments: Assignment[] = []) {
    this.teams = teams;
    this.tutors = tutors;
    // Ensure all fixed assignments HAVE the is_fixed flag set to true
    this.fixedAssignments = fixedAssignments.map(a => ({ ...a, is_fixed: true }));
    this.tutorGlobalUsage = new Map();
    tutors.forEach(t => this.tutorGlobalUsage.set(t.id, 0));

    // Initialize usage based on fixed assignments
    this.fixedAssignments.forEach(a => {
      this.tutorGlobalUsage.set(a.tutor_id, (this.tutorGlobalUsage.get(a.tutor_id) || 0) + 1);
    });

    // Calcular cuántos equipos tiene cada colegio (para equidad)
    this.schoolTeamCount = new Map();
    teams.forEach(t => {
      this.schoolTeamCount.set(t.school, (this.schoolTeamCount.get(t.school) || 0) + 1);
    });
  }

  public solve(): SolverResult {
    this.startTime = Date.now();
    
    // Filter out teams already assigned fixedly
    const fixedTeamIds = new Set(this.fixedAssignments.map(a => a.team_id));
    const teamsToAssign = this.teams.filter(t => !fixedTeamIds.has(t.id));

    // Sort by: 1) MRV, 2) School equity (fewer teams from same school = higher priority)
    const initialSorted = this.sortTeamsByPriority(teamsToAssign);
    
    // Start backtracking with fixed assignments already in the pool
    this.backtrack(initialSorted, [...this.fixedAssignments]);
    
    // Post-procesamiento: Rebalanceo activo para equidad escolar
    this.bestAssignments = this.optimizeEquity(this.bestAssignments);
    
    return this.buildResult();
  }

  /**
   * Evalúa la calidad de una solución, priorizando:
   * 1. Máxima cantidad de equipos asignados
   * 2. Mayor diversidad de colegios (equidad)
   */
  private scoreSolution(assignments: Assignment[]): number {
    const assignedTeamIds = new Set(assignments.map(a => a.team_id));

    // Contar colegios únicos representados
    const schoolsRepresented = new Set<string>();
    assignments.forEach(a => {
      const team = this.teams.find(t => t.id === a.team_id);
      if (team) schoolsRepresented.add(team.school);
    });

    // Score: cantidad de asignaciones * 1000 + colegios únicos
    // Esto prioriza primero más equipos, pero ante empate, más colegios diversos
    return assignedTeamIds.size * 1000 + schoolsRepresented.size;
  }

  private backtrack(remainingTeams: Team[], currentAssignments: Assignment[]): boolean {
    // Safety check for browser thread
    if (Date.now() - this.startTime > this.TIME_LIMIT) return true;

    // Track best solution found so far using weighted score
    const currentScore = this.scoreSolution(currentAssignments);
    if (currentScore > this.bestScore) {
      this.bestScore = currentScore;
      this.bestAssignments = [...currentAssignments];
    }

    // Success: all teams assigned
    if (remainingTeams.length === 0) return true;

    // Pick next team using MRV heuristic
    const team = remainingTeams[0];
    const nextRemaining = remainingTeams.slice(1);

    // Get available blocks for this team
    const validBlocks = team.availability.filter(b => !SchedulingRules.isBlockAtFullCapacity(b, currentAssignments));

    for (const blockId of validBlocks) {
      const eligibleTutors = this.getEligibleTutors(blockId, currentAssignments);
      
      for (const tutor of eligibleTutors) {
        // Assign (new assignments are NOT fixed by default)
        this.applyAssignment(team, tutor, blockId, currentAssignments);
        
        if (this.backtrack(nextRemaining, currentAssignments)) return true;

        // Backtrack
        this.undoAssignment(currentAssignments);
      }
    }

    // Branch: Try without assigning this team to prioritize others
    if (this.backtrack(nextRemaining, currentAssignments)) return true;

    return false;
  }

  private getEligibleTutors(blockId: string, currentAssignments: Assignment[]): Tutor[] {
    return this.tutors
      .filter(t => SchedulingRules.isTutorAvailable(t, blockId, currentAssignments, this.tutorGlobalUsage))
      // Heuristic: LCV (Least Constraining Value)
      .sort((a, b) => (this.tutorGlobalUsage.get(a.id) || 0) - (this.tutorGlobalUsage.get(b.id) || 0));
  }

  /**
   * Ordena equipos por prioridad de asignación:
   * 1. MRV: equipos con menos opciones de bloques primero (más difíciles de ubicar)
   * 2. Equidad: equipos de colegios con menos representación primero
   * 3. Alfabético como desempate final
   */
  private sortTeamsByPriority(teams: Team[]): Team[] {
    return [...teams].sort((a, b) => {
      // 1. MRV: menos opciones de disponibilidad = mayor prioridad
      const aLen = a.availability.length;
      const bLen = b.availability.length;
      if (aLen !== bLen) return aLen - bLen;

      // 2. Equidad escolar: colegios con menos equipos = mayor prioridad
      const aSchoolCount = this.schoolTeamCount.get(a.school) || 0;
      const bSchoolCount = this.schoolTeamCount.get(b.school) || 0;
      if (aSchoolCount !== bSchoolCount) return aSchoolCount - bSchoolCount;

      // 3. Desempate alfabético
      return a.name.localeCompare(b.name);
    });
  }

  private applyAssignment(team: Team, tutor: Tutor, blockId: string, assignments: Assignment[]) {
    assignments.push({
      competition_id: team.competition_id,
      team_id: team.id,
      tutor_id: tutor.id,
      block_id: blockId,
      is_fixed: false // New assignments are not fixed
    });
    this.tutorGlobalUsage.set(tutor.id, (this.tutorGlobalUsage.get(tutor.id) || 0) + 1);
  }

  private undoAssignment(assignments: Assignment[]) {
    const last = assignments.pop();
    if (last) {
      this.tutorGlobalUsage.set(last.tutor_id, (this.tutorGlobalUsage.get(last.tutor_id) || 0) - 1);
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

  /**
   * Post-procesamiento para mejorar la equidad.
   * Busca equipos sin asignar y verifica si pueden tomar el lugar de un equipo asignado
   * cuyo colegio tenga una sobre-representación (muchos más equipos asignados).
   */
  private optimizeEquity(assignments: Assignment[]): Assignment[] {
    let currentAssignments = [...assignments];
    let improved = true;

    while (improved) {
      improved = false;

      // 1. Contar equipos asignados por colegio
      const assignedCountBySchool = new Map<string, number>();
      this.teams.forEach(t => assignedCountBySchool.set(t.school, 0));
      currentAssignments.forEach(a => {
        const team = this.teams.find(t => t.id === a.team_id);
        if (team) {
          assignedCountBySchool.set(team.school, (assignedCountBySchool.get(team.school) || 0) + 1);
        }
      });

      // 2. Identificar equipos sin asignar
      const assignedIds = new Set(currentAssignments.map(a => a.team_id));
      const unassignedTeams = this.teams.filter(t => !assignedIds.has(t.id));

      let bestSwap: {
        unassignedTeam: Team;
        assignmentToReplace: Assignment;
        schoolDifference: number;
      } | null = null;

      // 3. Buscar el mejor intercambio posible
      for (const uTeam of unassignedTeams) {
        const uSchoolCount = assignedCountBySchool.get(uTeam.school) || 0;

        for (const blockId of uTeam.availability) {
          // Buscamos candidatos a reemplazar que no estén fijados por el usuario
          const candidates = currentAssignments.filter(a => a.block_id === blockId && !a.is_fixed);

          for (const candidate of candidates) {
            const candidateTeam = this.teams.find(t => t.id === candidate.team_id);
            if (!candidateTeam) continue;

            const cSchoolCount = assignedCountBySchool.get(candidateTeam.school) || 0;
            const difference = cSchoolCount - uSchoolCount;

            // Intercambiamos solo si mejora estrictamente la equidad (diferencia > 1)
            // Priorizamos la mayor diferencia (ej: quitarle a un colegio con 5 para darle a uno con 0)
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

      // 4. Aplicar el intercambio si encontramos uno
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

