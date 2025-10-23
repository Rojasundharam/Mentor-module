Getting Started with Institutions
1. API Access Requirements
Valid API key (format: jk_xxxxx_xxxxx)
Institution details associated with your account
Access permissions for specific endpoints
2. Available Endpoints
/api-management/organizations/institutions - Get all institutions
/api-management/organizations/institutions/[id] - Get institution by ID
3. Basic API Call

// Fetch institutions example
const fetchInstitutions = async (apiKey) => {
  try {
    const response = await fetch('https://jkkn.ai/api/api-management/organizations/institutions', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching institutions:', error);
    throw error;
  }
};
4. Response Structure

{
  "data": [
    {
      // institutions data fields
      "id": "value",
      "name": "value",
      "counselling_code": "value",
      "category": "value",
      "institution_type": "value",
      "is_active": "value",
      "created_at": "value",
      "updated_at": "value"
    }
    // More items...
  ],
  "metadata": {
    "page": 1,
    "totalPages": 5,
    "total": 124
  }
}
Componets :


import React, { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface ApiFetcherProps {
  endpoint: string;
  onDataReceived: (data: unknown) => void;
  apiKey?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
}

const BASE_URL = 'https://jkkn.ai/api';

export const ApiFetcher: React.FC<ApiFetcherProps> = ({
  endpoint,
  onDataReceived,
  apiKey,
  method = 'GET',
  body
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
          method,
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          ...(body && { body: JSON.stringify(body) }),
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        onDataReceived(result);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [endpoint, apiKey, method, body, onDataReceived, toast]);

   return isLoading ? (
    <div className='flex justify-center items-center'>
      <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900'></div>
    </div>
  ) : null;
};
                          