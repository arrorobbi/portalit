import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Topbar from "@/app/components/TopBar";
import * as fs from 'fs';
import Dashboard from "@/app/components/dashboard";
import { Activity, CheckCircle } from "lucide-react"; // Replace with your icons if necessary
import { json } from "stream/consumers";

// Define types for the device and sensor objects
type Sensor = {
  title: string;
  value: number | string;  // Allow value to be either number or string
  unit: string;
  status: string;
  color: string;
  icon: keyof typeof iconMap;  // Ensure icon matches the keys of the iconMap
};

type Device = {
  id: string;
  deviceName: string;
  ipAddress: string;
  group: string;
  sensors: Sensor[];
};

type DataPageProps = {
  devices: Device[];
  token: string;
};

// Map icons to JSX components
const iconMap = {
  Activity: <Activity className="text-orange-500" />,
  CheckCircle: <CheckCircle className="text-green-500" />,
} as const;  // `as const` ensures the keys are treated as literals

// Type to restrict icon keys
type IconKey = keyof typeof iconMap;

const DataPage = ({ devices, token }: DataPageProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    } else {
      localStorage.setItem("prtg", token);
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen p-4">
      <Topbar />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 p-4 mt-20">
        {devices.map((device, index) => (
          <Dashboard
            key={index}
            {...device}
            sensors={device.sensors.map((sensor) => ({
              ...sensor,
              icon: iconMap[sensor.icon], // Map string to JSX
            }))}
          />
        ))}
      </div>
    </div>
  );
};

interface basic {
  active: string;
  host: string;
  hostv6: string;
  ipversion: string;
  name: string;
  parenttags: string[];
  priority: string;
  tags: string[];
}

interface parent {
  id: string;
  name: string;
  type: string;
  href: string;
}

interface AllDevice {
  basic: basic;
  href: string;
  id: string;
  kind: string;
  kind_variant: string;
  name: string;
  parent: parent;
  status: string;
  type: string;
}

interface parsedSensor {
  id: string;
  name: string;
  status: string;
  // Add other properties here based on your data structure
}

export const getServerSideProps = async () => {
  const payload = {
    username: "prtgadmin",
    password: "prtgCC1x",
  };

  let devices: Device[] = [];
  let token = "";

  try {
    const login = await fetch(
      `${process.env.NEXT_PUBLIC_API_PRTG_URL}/api/v2/session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (login.ok) {
      const loginData = await login.json();
      token = loginData.token;
      console.log(loginData);

      const getDevice = await fetch(
        `${process.env.NEXT_PUBLIC_API_PRTG_URL}/api/v2/experimental/devices?offset=0&limit=100`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      const deviceData = await getDevice.json();
      // console.log("DATAA: ", deviceData[0].basic["host"]);

      // Use Promise.all to wait for all async operations to complete
      const devicePromises = deviceData.map(async (device: AllDevice) => {
        // Fetch details for each device asynchronously
        const getDetails = await fetch(
          `${process.env.NEXT_PUBLIC_API_PRTG_URL}/api/v2/sensors?filter=ancestors contains "${device.id}"&limit=0&include_all_channels=true`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        const details = await getDetails.json();

        // Return the device data after async fetch completes
        const pingValue = details[0]?.channels[0]?.last_measurement?.display_value || "no data";
        const sflowValue = details[1]?.channels[0]?.last_measurement?.display_value || "no data";
        // Ensure the value is a number before formatting
        const sflow = typeof sflowValue === "number" ? Number(sflowValue.toFixed(2)) : sflowValue;

        // console.log("Ping display_volume:", typeof sflow); // null
        // console.log("sFlow display_volume:", sflowDisplayVolume); // 3.78125
        return {
          id: device.id,
          deviceName: device.name,
          ipAddress: device.basic["host"] || "invalid",
          group: device.parent["name"] || "invalid",
          sensors: [
            {
              title: "sFlow",
              value: sflow,
              unit: "Mbit/s",
              status: "get data",
              color: "#F59E0B",
              icon: "Activity", // Store as string
            },
            {
              title: "Ping",
              value: pingValue,
              unit: "msec",
              status: "get data",
              color: "#84CC16",
              icon: "CheckCircle", // Store as string
            },
          ],
        };
      });

      // Wait for all async operations to finish before proceeding
      devices = await Promise.all(devicePromises);
    } else {
      console.error("Failed to fetch session data:", login.statusText);
    }
  } catch (error) {
    console.error("Error during API request:", error);
  }

  return {
    props: {
      devices,
      token,
    },
  };
};

export default DataPage;
