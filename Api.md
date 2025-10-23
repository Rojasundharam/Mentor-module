degree :
Getting Started with Departments
1. API Access Requirements
Valid API key (format: jk_xxxxx_xxxxx)
Institution details associated with your account
Access permissions for specific endpoints
2. Available Endpoints
/api-management/organizations/departments - Get all departments
/api-management/organizations/departments/[id] - Get department by ID
3. Basic API Call

// Fetch departments example
const fetchDepartments = async (apiKey) => {
  try {
    const response = await fetch('https://jkkn.ai/api/api-management/organizations/departments', {
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
    console.error('Error fetching departments:', error);
    throw error;
  }
};
4. Response Structure

{
  "data": [
    {
      // departments data fields
      "id": "value",
      "name": "value",
      "code": "value",
      "institution_id": "value",
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
componets :

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
                          
                          Example :
                          'use client';

import { useState } from 'react';
import { ApiFetcher } from '@/components/institution';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Department {
  id: string;
  name: string;
  code: string;
  institution_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  data: Department[];
  metadata: {
    page: number;
    totalPages: number;
    total: number;
  };
}

export default function DepartmentsList() {
  const [departments, setDepartments] = useState<ApiResponse | null>(null);

  const handleData = (data: unknown) => {
    setDepartments(data as ApiResponse);
  };

  return (
    <main className="container mx-auto p-6 space-y-6">
      <ApiFetcher
        endpoint="/api-management/organizations/departments"
        apiKey="your_api_key_here"
        onDataReceived={handleData}
      />

      {departments?.data.map((department) => (
        <Card key={department.id} className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{department.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Code: {department.code}
                </p>
              </div>
              <Badge variant={department.is_active ? 'default' : 'secondary'}>
                {department.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </main>
  );
}