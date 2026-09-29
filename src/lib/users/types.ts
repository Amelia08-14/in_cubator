// Types des comptes gérés depuis l'administration (miroir de backend/src/modules/users).

export type UserRow = {
  id: string;
  email: string;
  name: string;
  role: string;
  actif: boolean;
  isStaff: boolean;
  /** Sections accessibles : toutes pour un administrateur, la liste cochée pour un manager. */
  sections: string[];
  createdAt: string;
};

export type UsersStats = { total: number; actifs: number; desactives: number; equipe: number };

export type StaffRole = "ADMIN" | "GESTIONNAIRE";
