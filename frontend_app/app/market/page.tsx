"use client"

import { useContractRead } from "wagmi";
import poolData from '@/public/poolData.json'
import { Pool } from "@/type/poolOffer";
import { useState } from "react";
import Link from "next/link";

const Market = () => {

    const [pools,setPools] = useState<Pool[]>([])

    useContractRead({
        address: `0x${process.env.NEXT_PUBLIC_POOL_DATA_ADDRESS}`,
        abi: poolData,
        onSuccess: (data: Pool[]) => {
            setPools(data)
        },
        functionName: 'getPoolData',
        args: [],
        enabled: true,
    });


    return (
        <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Pool name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Token Address
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {   pools.map((pool:Pool)=>{
                            return(
                                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {pool.poolName}
                                </th>
                                <td className="px-6 py-4">
                                    {pool.poolAddress}
                                </td>
                                <td className="px-6 py-4">
                                    <Link href={`/market/${pool.poolAddress}-${pool.poolName}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">See Details</Link>
                                </td>
                            </tr>
                            )
                        })

                        }
                    
                    </tbody>
                </table>
            </div>

        </>
    )
}


export default Market;