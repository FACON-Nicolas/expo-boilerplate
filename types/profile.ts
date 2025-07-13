export type Profile = {
  id: number;
  createdAt: string;
  firstname: string;
  lastname: string;
  userId: string;
};

export type CreateProfile = Pick<Profile, 'firstname' | 'lastname'>;
export type UpdateProfile = Partial<CreateProfile>;
