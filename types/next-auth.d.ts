import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    isOrganizer?: boolean;
    organizationNumber?: string;
    organizerName?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      isOrganizer?: boolean;
      organizationNumber?: string;
      organizerName?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isOrganizer?: boolean;
    organizationNumber?: string;
    organizerName?: string;
  }
}
