import { solveScheduling } from '../lib';
import { Team, Tutor, Assignment } from '../types';

self.onmessage = (e: MessageEvent<{ teams: Team[]; tutors: Tutor[]; fixedAssignments: Assignment[] }>) => {
  const { teams, tutors, fixedAssignments } = e.data;
  const result = solveScheduling(teams, tutors, fixedAssignments);
  self.postMessage(result);
};
