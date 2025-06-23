export type Profile = {
  id: number;
  createdAt: string;
  firstname: string;
  lastname: string;
  userId: string;
};

export type CreateProfile = {
  firstname: string;
  lastname: string;
};

export type UpdateProfile = Partial<CreateProfile>;
