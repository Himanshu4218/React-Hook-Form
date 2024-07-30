interface Address {
  city: string;
  state: string;
}

interface Hobby {
  name: string;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: string;
  address: Address;
  hobbies: Hobby[];
  startDate: Date;
  subscribe: boolean;
  referral: string;
}
