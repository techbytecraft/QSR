import React from 'react';
import EnvironmentManager from '../EnvironmentManager';

const EnvironmentView: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <EnvironmentManager />
    </div>
  );
};

export default EnvironmentView;
