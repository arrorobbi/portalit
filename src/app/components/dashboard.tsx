import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { CheckCircle, Activity } from "lucide-react";

// Define types for props
type SensorData = {
    title: string;
    value: number | string;
    unit: string;
    status: string;
    color: string;
    icon: React.ReactNode;
  };
  
  type DashboardProps = {
    deviceName: string;
    ipAddress: string;
    dependency: string;
    sensors: SensorData[];
  };
  
  const Dashboard: React.FC<DashboardProps> = ({ deviceName, ipAddress, dependency, sensors }) => {
    return (
        <div className="p-6 w-full bg-gray-100">
            <div className="mb-2">
            <h1 className="text-2xl font-bold text-gray-800">{deviceName}</h1>
            <div className="text-sm text-gray-600">
                Type: Device | DNS Name/IP Address: {ipAddress} | Dependency: {dependency}
            </div>
            </div>
    
            <div className="grid grid-cols-2 gap-6">
            {sensors.map((sensor, index) => (
                <Card key={index} className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    {sensor.icon}
                    {sensor.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-center">
                    <div className="relative">
                        <svg className="w-32 h-32">
                        <circle
                            cx="50%"
                            cy="50%"
                            r="45%"
                            stroke="#E5E7EB"
                            strokeWidth="10"
                            fill="none"
                        />
                        <circle
                            cx="50%"
                            cy="50%"
                            r="45%"
                            stroke={sensor.color}
                            strokeWidth="10"
                            strokeDasharray="282.6"
                            strokeDashoffset={282.6 - (sensor.value as number) * 2.826}
                            fill="none"
                        />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-semibold">{sensor.value}</span>
                        <span className="text-sm text-gray-500">{sensor.unit}</span>
                        </div>
                    </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">{sensor.status}</p>
                </CardContent>
                </Card>
            ))}
            </div>
        </div>
    );
  };

export default Dashboard;
