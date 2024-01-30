import { Market } from "@/type/market";

interface ProductCardProps {
    market: Market
    onClick:()=>void
}

const PoolCard = ({market,onClick}:ProductCardProps) => {
    return (
        <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
            <div>
                <a className="group relative mb-2 block h-96 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:mb-3">
                    <img src={market.productImage} loading="lazy" alt="Photo by Austin Wade" className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
                </a>
                <div className="flex flex-col items-start justify-between gap-2 px-2">
                    <div className="flex flex-col">
                        <a href="#" className="text-lg font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-xl">{market.name}</a>
                    </div>
                    <hr/>
                    <div className="flex flex-col items-start">
                        <span className="font-bold text-gray-600 lg:text-lg">Address: {market.contractPlace.slice(0,12)}...</span>
                        <span className="text-lg text-red-500">{String(market.price).replace("n","")} WEI</span>
                    </div>
                    <div>
                        <button onClick={onClick} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Buy</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PoolCard;