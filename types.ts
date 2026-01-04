
export interface Exercise {
  id: number;
  prompt: string;
  answer: string;
  rule: string;
}

export interface Level {
  id: number;
  title: string;
  exercises: Exercise[];
}
