import { NavigationHeader } from '../NavigationHeader';
import type { User } from '@shared/schema';

const mockUser: User = {
  id: '1',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  profileImageUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function NavigationHeaderExample() {
  return (
    <div className="space-y-4">
      <NavigationHeader 
        user={mockUser}
        onLogout={() => console.log('Logout clicked')}
      />
      <NavigationHeader 
        user={null}
        onLogout={() => console.log('Logout clicked')}
      />
    </div>
  );
}