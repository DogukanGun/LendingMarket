"use client"
import { Market } from "@/type/market";
import { useState } from "react";
import { useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import marketAbi from '@/public/market.json'
import productAbi from '@/public/product.json'
import PoolCard from "./component/productCard";

const Market = () => {
    const [market, setMarket] = useState<Market[]>()
    const [productAddress,setProductAddress] = useState("")
    const [price,setPrice] = useState("")
    const { config } = usePrepareContractWrite({
        address: `0x${productAddress.replace("0x","")}`,
        abi: productAbi.abi,
        functionName: 'buy',
        value:BigInt(price),
        args: [],
    });
    const { data, isLoading, isSuccess,write, error  } = useContractWrite(config);

    useContractRead({
        address: `0x${process.env.NEXT_PUBLIC_MARKET_ADDRESS}`,
        abi: marketAbi,
        onSuccess: (data: Market[]) => {
            setMarket(data)
        },
        functionName: 'getProducts',
        args: [],
        enabled: true,
    });

    const buyProduct = (contractAddress: string, price: string) => {
        setProductAddress(contractAddress);
        setPrice(price);
        write && write();
    }

    return (
        <div className="bg-white py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                <div className="mb-10 md:mb-16">
                    <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Market</h2>
                </div>
                {market?.map((market: Market) => {
                    return (
                        <PoolCard key={`market-${market.contractPlace}`} onClick={() => buyProduct(market.contractPlace, String(market.price).replace("n", ""))} market={market} />
                    )
                })}
            </div>
        </div>
    )
}


export default Market;