export enum ContactStatus {
    NEW = 'new',
    READ = 'read',
    REPLIED = 'replied',
    ARCHIVED = 'archived'
  }
  
  export interface Contact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    createdAt: Date;
    status: ContactStatus;
    repliedAt?: Date;
    repliedBy?: string;
  }
  
  export interface ContactReply {
    id: string;
    contactId: string;
    message: string;
    sentAt: Date;
    sentBy: string;
  }