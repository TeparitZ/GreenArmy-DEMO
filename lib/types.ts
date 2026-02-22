export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED';
export type UserRole = 'USER' | 'ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface EventListItem {
  id: string;
  title: string;
  description: string;
  date: string;
  address: string;
  lat: number;
  lng: number;
  imageUrl: string;
  status: EventStatus;
  acceptDonations: boolean;
  acceptVolunteers: boolean;
  totalTrees: number;
  organizerId: string;
  organizerName: string;
  participantCount: number;
  totalDonations: number;
  createdAt: string;
}

export interface EventDetail extends EventListItem {
  participants: {
    id: string;
    userId: string;
    userName: string;
    joinedAt: string;
  }[];
  donations: {
    id: string;
    userId: string;
    userName: string;
    amount: number;
    createdAt: string;
  }[];
  activities: {
    id: string;
    authorId: string;
    authorName: string;
    description: string;
    imageUrl?: string;
    treesPlanted: number;
    createdAt: string;
  }[];
}
