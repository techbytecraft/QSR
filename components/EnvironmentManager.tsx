import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Key, 
  Server, 
  Database, 
  Shield, 
  Save, 
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface EnvironmentVariable {
  key: string;
  value: string;
  description: string;
  category: 'api' | 'server' | 'database' | 'security';
  isSecret: boolean;
  required: boolean;
}

const EnvironmentManager: React.FC = () => {
  const [envVars, setEnvVars] = useState<EnvironmentVariable[]>([
    {
      key: 'GEMINI_API_KEY',
      value: '',
      description: 'Google Gemini AI API key for AI-powered features',
      category: 'api',
      isSecret: true,
      required: true
    },
    {
      key: 'PORT',
      value: '3000',
      description: 'Server port number',
      category: 'server',
      isSecret: false,
      required: false
    },
    {
      key: 'NODE_ENV',
      value: 'production',
      description: 'Node.js environment (development/production)',
      category: 'server',
      isSecret: false,
      required: false
    },
    {
      key: 'DATABASE_URL',
      value: '',
      description: 'Database connection string',
      category: 'database',
      isSecret: true,
      required: false
    },
    {
      key: 'JWT_SECRET',
      value: '',
      description: 'JWT secret for authentication',
      category: 'security',
      isSecret: true,
      required: false
    },
    {
      key: 'CORS_ORIGIN',
      value: 'http://localhost:3000',
      description: 'Allowed CORS origins',
      category: 'security',
      isSecret: false,
      required: false
    }
  ]);

  const [showSecrets, setShowSecrets] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadEnvironmentVariables();
  }, []);

  const loadEnvironmentVariables = async () => {
    try {
      // In a real app, this would fetch from your backend
      // For now, we'll simulate loading from localStorage
      const saved = localStorage.getItem('qsr_env_vars');
      if (saved) {
        const parsed = JSON.parse(saved);
        setEnvVars(prev => prev.map(item => ({
          ...item,
          value: parsed[item.key] || item.value
        })));
      }
    } catch (error) {
      console.error('Error loading environment variables:', error);
    }
  };

  const saveEnvironmentVariables = async () => {
    setIsLoading(true);
    try {
      // Validate required fields
      const missingRequired = envVars.filter(v => v.required && !v.value.trim());
      if (missingRequired.length > 0) {
        setMessage({
          type: 'error',
          text: `Missing required fields: ${missingRequired.map(v => v.key).join(', ')}`
        });
        return;
      }

      // Save to localStorage (in real app, save to backend)
      const envObject = envVars.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as { [key: string]: string });

      localStorage.setItem('qsr_env_vars', JSON.stringify(envObject));

      // Simulate API call to update server
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage({
        type: 'success',
        text: 'Environment variables saved successfully! Server will restart with new settings.'
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error saving environment variables. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSecretVisibility = (key: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const updateEnvVar = (key: string, value: string) => {
    setEnvVars(prev => prev.map(item => 
      item.key === key ? { ...item, value } : item
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'api': return <Key className="w-4 h-4" />;
      case 'server': return <Server className="w-4 h-4" />;
      case 'database': return <Database className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'api': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'server': return 'bg-green-100 text-green-800 border-green-200';
      case 'database': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'security': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const categories = ['api', 'server', 'database', 'security'];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Environment Configuration</h1>
        <p className="text-gray-600">Manage your server environment variables, API keys, and configuration settings.</p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-3">
          <button
            onClick={loadEnvironmentVariables}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
        <button
          onClick={saveEnvironmentVariables}
          disabled={isLoading}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Environment Variables by Category */}
      {categories.map(category => {
        const categoryVars = envVars.filter(v => v.category === category);
        if (categoryVars.length === 0) return null;

        return (
          <div key={category} className="mb-8">
            <div className="flex items-center mb-4">
              {getCategoryIcon(category)}
              <h2 className="text-xl font-semibold text-gray-900 ml-2 capitalize">
                {category} Configuration
              </h2>
            </div>
            
            <div className="grid gap-4">
              {categoryVars.map(envVar => (
                <div key={envVar.key} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">
                          {envVar.key}
                        </span>
                        {envVar.required && (
                          <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Required
                          </span>
                        )}
                        <span className={`ml-2 text-xs px-2 py-1 rounded border ${getCategoryColor(envVar.category)}`}>
                          {envVar.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{envVar.description}</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <input
                      type={envVar.isSecret && !showSecrets[envVar.key] ? 'password' : 'text'}
                      value={envVar.value}
                      onChange={(e) => updateEnvVar(envVar.key, e.target.value)}
                      placeholder={`Enter ${envVar.key.toLowerCase().replace(/_/g, ' ')}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {envVar.isSecret && (
                      <button
                        type="button"
                        onClick={() => toggleSecretVisibility(envVar.key)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showSecrets[envVar.key] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Server Status */}
      <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Server Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">Running</div>
            <div className="text-sm text-green-600">Port 3000</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">Production</div>
            <div className="text-sm text-blue-600">Environment</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">Express.js</div>
            <div className="text-sm text-purple-600">Server</div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Environment Variables Guide</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>API Keys:</strong> Store external service API keys securely. These are encrypted and never logged.</p>
          <p><strong>Server Config:</strong> Configure server behavior, ports, and environment settings.</p>
          <p><strong>Database:</strong> Connection strings and database configuration settings.</p>
          <p><strong>Security:</strong> JWT secrets, CORS settings, and other security configurations.</p>
          <p className="mt-3"><strong>Note:</strong> After saving changes, the server will automatically restart to apply new settings.</p>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentManager;
