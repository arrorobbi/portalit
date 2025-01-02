import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Topbar from "@/app/components/TopBar";
import Dashboard from "@/app/components/dashboard";
import { Activity, CheckCircle } from "lucide-react"; // Replace with your icons if necessary

// Define types for the device and sensor objects
type Sensor = {
  title: string;
  value: number;
  unit: string;
  status: string;
  color: string;
  icon: JSX.Element;
};

type Device = {
  deviceName: string;
  ipAddress: string;
  dependency: string;
  sensors: Sensor[];
};

const DataPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [devices, setDevices] = useState<Device[]>([]); // Set devices as an array of Device type
  const [toke, setToken] = useState("")

  const data: Device[] = [
    {
      deviceName: "MLG1NC",
      ipAddress: "10.0.90.252",
      dependency: "Aruba Region IV",
      sensors: [
        {
          title: "sFlow",
          value: 0.3,
          unit: "Mbit/s",
          status: "Status since 1 h 31 m",
          color: "#F59E0B",
          icon: <Activity className="text-orange-500" />,
        },
        {
          title: "Ping",
          value: 19,
          unit: "msec",
          status: "Status since 4 d 2 h",
          color: "#84CC16",
          icon: <CheckCircle className="text-green-500" />,
        },
      ],
    },
    {
      deviceName: "SBY 1 NC",
      ipAddress: "10.0.51.253",
      dependency: "Aruba Region V",
      sensors: [
        {
          title: "sFlow",
          value: 1.0,
          unit: "Mbit/s",
          status: "Status since 2 h 10 m",
          color: "#F59E0B",
          icon: <Activity className="text-orange-500" />,
        },
        {
          title: "Ping",
          value: 23,
          unit: "msec",
          status: "Status since 3 d 5 h",
          color: "#84CC16",
          icon: <CheckCircle className="text-green-500" />,
        },
      ],
    },
    {
        deviceName: "SBY 1 UC",
        ipAddress: "10.0.4.253",
        dependency: "Aruba Region V",
        sensors: [
          {
            title: "sFlow",
            value: 1.2,
            unit: "Mbit/s",
            status: "Status since 2 h 10 m",
            color: "#F59E0B",
            icon: <Activity className="text-orange-500" />,
          },
          {
            title: "Ping",
            value: 30,
            unit: "msec",
            status: "Status since 3 d 5 h",
            color: "#84CC16",
            icon: <CheckCircle className="text-green-500" />,
          },
        ]
    }
    // Add other devices here...
  ];

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    } else {
        const login = async () => {
            const payload = {
                username: process.env.NEXT_PUBLIC_API_BASE_username,
                password: process.env.NEXT_PUBLIC_API_BASE_password,
              }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_PRTG_URL}/api/v2/session`,
                {
                  method: "POST",
                  body: JSON.stringify(payload),
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
      
            //   const result =  await res.json();
              console.log(res);
              return res
        }
     
      login()
      setDevices(data); // Set the devices data into state
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen p-4">
      <Topbar />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 p-4 mt-10">
        {devices.map((device, index) => (
          <Dashboard key={index} {...device} />
        ))}
      </div>
    </div>
  );
};

export default DataPage;
