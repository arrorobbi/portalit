import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Topbar from "@/app/components/TopBar";

const DataPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    } else {
      const pagination = {
        paginate: 'false',
        page: 1,
        limit: 10,
        order_by: 'createdAt',
        order_dir: 'DESC',
        source: 'all',
        value: 'all',
      };
    //   const fetchBookings = async () => {
    //     let response;
    //     try {
    //       if (role !== "owner") {
    //         response = await BookingApi.getToday(pagination, session.token as string);
    //       } else if (role === "owner") {
    //         response = await BookingApi.getByOwner(pagination, session.token as string);
    //       }
    //       const data = await response?.json();
    //       if (data.statusCode === 403){
    //         setForbidden(true)
    //       } else if (data.message === "You Are Login In Another Device, Please Logout"){
    //         setOtherDevice(true)
    //       } else if (!response?.ok) {
    //         setShowAlert(!response?.ok);
    //         setAlertMessage(data.message);
    //         setAlertType("warning");
    //         throw new Error("Failed to fetch patient");
    //       }
    //       setTotalPages(Math.ceil(data.data.count / limit));
    //       setBookings(data);
    //     } catch (error) {
    //       console.error(error);
    //     } finally {
    //       setLoadingBookings(false);
    //     }
    //   };

    //   fetchBookings();
    }
  }, [session, status, router]);
  return (
    <>
      <Topbar />
     <p>DASHBOARD</p>
    </>
  );
};

export default DataPage;
