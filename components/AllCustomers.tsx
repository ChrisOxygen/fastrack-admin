import { UserDataType } from "@/types";
import clsx from "clsx";
import { useRef, useState } from "react";
import { BiSearch, BiSortAZ, BiSortDown, BiSortUp } from "react-icons/bi";
import UserRow from "./UserRow";

type AllCustomersProps = {
  allCustomers: UserDataType[];
};

function AllCustomers({ allCustomers }: AllCustomersProps) {
  const [sortByDate, setSortByDate] = useState(false);
  const [sortbyAlpha, setSortbyAlpha] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const resetFilters = () => {
    setSortByDate(false);
    setSortbyAlpha(false);
    setSearchTerm("");
  };

  const defaultSortCustomers = allCustomers.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const sortedCustomers = () => {
    let sorted = defaultSortCustomers;
    if (sortbyAlpha) {
      sorted = allCustomers.sort((a, b) =>
        a.firstName.localeCompare(b.firstName)
      );
    }
    if (sortByDate) {
      sorted = allCustomers.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    if (searchTerm) {
      sorted = allCustomers.filter(
        (customer) =>
          customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return sorted;
  };

  const toggleSortByDate = () => {
    setSortByDate(!sortByDate);
  };

  const toggleSortbyAlpha = () => {
    setSortbyAlpha(!sortbyAlpha);
  };
  return (
    <section className="w-full flex flex-col gap-3 overflow-auto md:overflow-hidden rounded-2xl border border-siteHeadingDark/25 ">
      <div className=" flex flex-wrap gap-4 items-center w-full p-4 ">
        <h3 className=" shrink-0 text-3xl font-dm_sans text-siteHeadingDark font-semibold mr-auto">
          Customer List
        </h3>
        <div className=" flex items-center gap-3">
          <button
            className=" rounded-lg bg-siteHeadingDark h-[35px] grid place-items-center text-white font-dm_sans font-bold capitalize px-4"
            onClick={() => {
              resetFilters();
            }}
          >
            reset
          </button>
          <button
            className={clsx(
              "rounded-lg xsm:grid hidden h-[35px]  place-items-center bg-stone-200  font-dm_sans font-bold capitalize px-4 py-[6px] text-xl",
              sortByDate ? " text-green-500" : "text-siteHeadingDark"
            )}
            onClick={toggleSortByDate}
          >
            {sortByDate ? <BiSortUp /> : <BiSortDown />}
          </button>
          <button
            className={clsx(
              "rounded-lg  hidden h-[35px] lg:grid place-items-center bg-stone-200  font-dm_sans font-bold capitalize px-4 py-[6px] text-xl",
              sortbyAlpha ? " text-green-500" : "text-siteHeadingDark"
            )}
            onClick={toggleSortbyAlpha}
          >
            <BiSortAZ />
          </button>
          <div className=" h-[35px] flex items-center bg-stone-200 border border-siteHeadingDark/25 rounded-lg px-3 ">
            <input
              type="text"
              name=""
              id=""
              value={searchTerm}
              placeholder="search by name.."
              className=" focus:border-0 focus:outline-0 active:outline-0 bg-transparent active:border-0 border-0 text-siteHeadingDark font-semibold font-dm_sans w-full"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="text-xl text-siteHeadingDark">
              <BiSearch />
            </button>
          </div>
        </div>
      </div>
      <div className=" w-full border-t border-b border-siteHeadingDark/25 p-4 hidden sm:grid grid-cols-[minmax(200px,300px)_minmax(140px,160px)_minmax(140px,170px)_minmax(100px,1fr)] bg-stone-100">
        <div className=" uppercase font-dm_sans font-semibold text-stone-400">
          Full name - email
        </div>
        <div className="uppercase font-dm_sans font-semibold text-stone-400 justify-self-center">
          Last seen
        </div>
        <div className="uppercase font-dm_sans font-semibold text-stone-400 justify-self-center">
          Balance
        </div>
        <div className="uppercase font-dm_sans font-semibold text-stone-400 self-end justify-self-end mr-5">
          details
        </div>
      </div>
      <div className=" w-full border-t border-b border-siteHeadingDark/25 p-4 sm:hidden flex justify-between bg-stone-100">
        <div className=" uppercase font-dm_sans font-semibold text-stone-400">
          Full name - email
        </div>

        <div className="uppercase font-dm_sans font-semibold text-stone-400 justify-self-center">
          Balance
        </div>
      </div>
      <div className="flex flex-col overflow-scroll">
        {sortedCustomers().map((customer, index) => (
          <UserRow key={index} customer={customer} />
        ))}
      </div>
    </section>
  );
}

export default AllCustomers;
