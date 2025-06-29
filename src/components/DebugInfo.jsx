import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export default function DebugInfo() {
  const [debugInfo, setDebugInfo] = useState({
    apiUrl: API_ENDPOINTS.GET_LISTINGS,
    backendHealth: null,
    listingsResponse: null,
    error: null
  });

  const testBackend = async () => {
    try {
      // Test health endpoint
      const healthRes = await axios.get('https://stayfinder-backend-j3p3.onrender.com/health');
      setDebugInfo(prev => ({ ...prev, backendHealth: healthRes.data }));

      // Test listings endpoint
      const listingsRes = await axios.get(API_ENDPOINTS.GET_LISTINGS);
      setDebugInfo(prev => ({ ...prev, listingsResponse: listingsRes.data }));
    } catch (err) {
      setDebugInfo(prev => ({ 
        ...prev, 
        error: {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          config: {
            url: err.config?.url,
            method: err.config?.method
          }
        }
      }));
    }
  };

  useEffect(() => {
    testBackend();
  }, []);

  return (
    <div style={{
      padding: '2rem',
      background: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      margin: '1rem',
      fontFamily: 'monospace',
      fontSize: '14px'
    }}>
      <h3>🔍 Debug Information</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <strong>API URL:</strong> {debugInfo.apiUrl}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Environment Variables:</strong>
        <div>VITE_API_URL: {import.meta.env.VITE_API_URL || 'Not set'}</div>
      </div>

      {debugInfo.backendHealth && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Backend Health:</strong>
          <pre style={{ background: '#fff', padding: '0.5rem', borderRadius: '4px' }}>
            {JSON.stringify(debugInfo.backendHealth, null, 2)}
          </pre>
        </div>
      )}

      {debugInfo.listingsResponse && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Listings Response:</strong>
          <div>Status: 200</div>
          <div>Count: {Array.isArray(debugInfo.listingsResponse) ? debugInfo.listingsResponse.length : 'Not an array'}</div>
          <pre style={{ background: '#fff', padding: '0.5rem', borderRadius: '4px', maxHeight: '200px', overflow: 'auto' }}>
            {JSON.stringify(debugInfo.listingsResponse, null, 2)}
          </pre>
        </div>
      )}

      {debugInfo.error && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Error:</strong>
          <div style={{ color: '#dc3545' }}>
            <div>Message: {debugInfo.error.message}</div>
            <div>Status: {debugInfo.error.status}</div>
            <div>URL: {debugInfo.error.config?.url}</div>
            <div>Method: {debugInfo.error.config?.method}</div>
            {debugInfo.error.data && (
              <pre style={{ background: '#fff', padding: '0.5rem', borderRadius: '4px', color: '#dc3545' }}>
                {JSON.stringify(debugInfo.error.data, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}

      <button 
        onClick={testBackend}
        style={{
          padding: '0.5rem 1rem',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Again
      </button>
    </div>
  );
} 