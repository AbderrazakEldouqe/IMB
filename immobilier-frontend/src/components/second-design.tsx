import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, FilterIcon } from "@heroicons/react/solid";
import { SearchIcon } from "@heroicons/react/outline";

const filters = {
  webSites: [
    { value: "marocannonces", label: "Maroc Annonces", checked: false },
    { value: "avito", label: "Avito", checked: false },
  ],
  type: [
    { value: "appartement", label: "Appartement", checked: false },
    { value: "villa", label: "Villa", checked: false },
  ],
  transaction: [
    { value: "vente", label: "Vente", checked: false },
    { value: "location", label: "Location", checked: false },
  ],
};

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SecondDesign() {
  const [users, setUsers] = useState([]);
  const [checkedTransaction, setCheckedTransaction] = useState<any>([]);
  const [checkedType, setCheckedType] = useState<any>([]);
  const [checkedWebsites, setCheckedWebsites] = useState<any>([]);
  const [countFilters, setCountFilters] = useState<number>(0);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [sortOptions, setSortOptions] = useState<any>([
    { value: "asc", name: "Price: Low to High", current: false },
    { value: "desc", name: "Price: High to Low", current: false },
  ]);
  const [selectedSort, setSelectedSort] = useState<string>("");

  console.log("users", users);

  const setCharAt = (str: string, index: number, chr: string) => {
    if (index > str.length - 1 || index === -1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
  };

  const findIndexFirstCaractere = (str: string, chr: string) => {
    return str.indexOf(chr);
  };

  const replaceCharacter = (
    str: string,
    chrToFind: string,
    chrToRepmlace: string,
  ) => {
    return setCharAt(
      str,
      findIndexFirstCaractere(str, chrToFind),
      chrToRepmlace,
    );
  };

  const prepareUrl = (websites: any[], types: any[], transactions: any[]) => {
    let cptFilters = websites.length + types.length + transactions.length;
    let urlprepared = "http://localhost:8000/immobilier-search";
    if (searchFilter.length > 0) {
      urlprepared += `&search=${searchFilter}`;
      cptFilters += 1;
    }
    setCountFilters(cptFilters);

    if (checkedWebsites?.length > 0) {
      websites.forEach((r) => {
        urlprepared += `&source=${r}`;
      });
    }
    if (types?.length > 0) {
      types.forEach((r) => {
        urlprepared += `&type=${r}`;
      });
    }
    if (transactions?.length > 0) {
      transactions.forEach((r) => {
        urlprepared += `&transaction=${r}`;
      });
    }
    urlprepared += "&limit=1000";
    if (selectedSort.length > 0) {
      if (selectedSort === "desc") {
        urlprepared += "&ordering=-price";
      } else {
        urlprepared += "&ordering=price";
      }
    }
    urlprepared = replaceCharacter(urlprepared, "&", "?");
    return `${urlprepared}`;
  };
  const fetchData = async () => {
    const response = await fetch(
      prepareUrl(checkedWebsites, checkedType, checkedTransaction),
    );
    const data = await response.json();
    setUsers(data?.results);
  };

  const handleCheckTransaction = (event: any) => {
    const changedTransaction = filters.transaction.find((p) => {
      return p.value === event.target.value;
    });
    let updatedList = [...checkedTransaction];
    if (event.target.checked) {
      if (changedTransaction) {
        changedTransaction.checked = true;
      }
      updatedList = [...checkedTransaction, event.target.value];
    } else {
      if (changedTransaction) {
        changedTransaction.checked = false;
      }
      updatedList.splice(checkedTransaction.indexOf(event.target.value), 1);
    }
    console.log("updatedList", updatedList);
    setCheckedTransaction(updatedList);
    // fetchData();
  };

  const handleCheckType = (event: any) => {
    const changedType = filters.type.find((p) => {
      return p.value === event.target.value;
    });
    let updatedList = [...checkedType];
    if (event.target.checked) {
      if (changedType) {
        changedType.checked = true;
      }
      updatedList = [...checkedType, event.target.value];
    } else {
      if (changedType) {
        changedType.checked = false;
      }
      updatedList.splice(checkedType.indexOf(event.target.value), 1);
    }
    console.log("updatedList", updatedList);
    setCheckedType(updatedList);
    // fetchData();
  };

  const handleCheckWebsites = (event: any) => {
    const changedWebsite = filters.webSites.find((p) => {
      return p.value === event.target.value;
    });
    let updatedList = [...checkedWebsites];
    if (event.target.checked) {
      if (changedWebsite) {
        changedWebsite.checked = true;
      }
      updatedList = [...checkedWebsites, event.target.value];
    } else {
      if (changedWebsite) {
        changedWebsite.checked = false;
      }
      updatedList.splice(checkedWebsites.indexOf(event.target.value), 1);
    }
    console.log("updatedList", updatedList);
    setCheckedWebsites(updatedList);
    // fetchData();
  };

  const handleSearchFilter = (event: any) => {
    setSearchFilter(event.target.value);
  };

  const clearTransaction = () => {
    filters.transaction = filters.transaction.map((v) => {
      const item = { ...v };
      item.checked = false;
      return item;
    });
  };

  const clearType = () => {
    filters.type = filters.type.map((v) => {
      const item = { ...v };
      item.checked = false;
      return item;
    });
  };

  const clearWebsites = () => {
    filters.webSites = filters.webSites.map((v) => {
      const item = { ...v };
      item.checked = false;
      return item;
    });
  };
  const clearAll = () => {
    clearTransaction();
    clearType();
    clearWebsites();
    setCheckedWebsites([]);
    setCheckedTransaction([]);
    setCheckedType([]);
    setSearchFilter("");
  };

  const handleClickSorting = (valueSelectedSort: string) => {
    setSelectedSort(valueSelectedSort);
    const sort = sortOptions.map((v: any) => {
      const item = { ...v };
      if (item.value === valueSelectedSort) {
        item.current = true;
      } else {
        item.current = false;
      }
      return item;
    });
    console.log("sorting", sort);
    setSortOptions(sort);
  };

  const Capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  useEffect(() => {
    fetchData();
  }, [
    checkedWebsites,
    checkedTransaction,
    checkedType,
    searchFilter,
    selectedSort,
  ]);

  return (
    <div className="bg-white">
      {/* Mobile menu */}

      <header className="relative bg-white sticky">
        <p className="bg-indigo-600 h-10 flex items-center justify-center text-sm font-medium text-white px-4 sm:px-6 lg:px-8">
          Welcome to Scraping APP
        </p>
      </header>

      <main className="pb-24">
        {/* Filters */}
        <Disclosure
          as="section"
          aria-labelledby="filter-heading"
          className="bg-white border-t border-b border-gray-200 grid items-center sticky top-0 z-50"
        >
          <h2 id="filter-heading" className="sr-only">
            Filters
          </h2>
          <div className="relative col-start-1 row-start-1 py-4">
            <div className="max-w-7xl mx-auto flex space-x-6 divide-x divide-gray-200 text-sm px-4 sm:px-6 lg:px-8">
              <div>
                <Disclosure.Button className="group text-gray-700 font-medium flex items-center">
                  <FilterIcon
                    className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  {countFilters} Filters
                </Disclosure.Button>
              </div>
              <div className="pl-6">
                <button
                  type="button"
                  className="text-gray-500"
                  onClick={clearAll}
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="border-t border-gray-200 py-2">
            <div className="relative min-h-full flex flex-col mb-2">
              <div className="flex-shrink-0">
                <div className="max-w-2xl mx-auto px-2 sm:px-4 lg:px-8 ">
                  <div className="relative flex items-center justify-between h-16">
                    {/* Search section */}
                    <div className="flex-1 flex justify-center lg:justify-end">
                      <div className="w-full px-6 lg:px-6">
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        <label htmlFor="search" className="sr-only">
                          Search projects
                        </label>
                        <div className="relative text-indigo-200 focus-within:text-gray-400">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            id="search"
                            name="search"
                            className="block w-full pl-10 pr-3 py-2 border  rounded-md leading-5  bg-opacity-25 text-indigo-400 placeholder-indigo-400 focus:outline-none focus:bg-white focus:ring-0 focus:placeholder-gray-400 focus:text-gray-900 sm:text-sm"
                            placeholder="Search by anythings"
                            type="search"
                            value={searchFilter}
                            onChange={handleSearchFilter}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-2 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8">
              <div className="grid grid-cols-1 gap-y-10 auto-rows-min md:grid-cols-2 md:gap-x-6">
                <fieldset>
                  <legend className="block font-medium">Web Sites</legend>
                  <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                    {filters.webSites.map((option, optionIdx) => (
                      <div
                        key={option.value}
                        className="flex items-center text-base sm:text-sm"
                      >
                        <input
                          id={`websites-${optionIdx}`}
                          name="websites[]"
                          defaultValue={option.value}
                          onChange={handleCheckWebsites}
                          type="checkbox"
                          className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                          checked={option.checked}
                        />
                        <label
                          htmlFor={`websites-${optionIdx}`}
                          className="ml-3 min-w-0 flex-1 text-gray-600"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="block font-medium">Type</legend>
                  <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                    {filters.type.map((option, optionIdx) => (
                      <div
                        key={option.value}
                        className="flex items-center text-base sm:text-sm"
                      >
                        <input
                          id={`type-${optionIdx}`}
                          name="type[]"
                          defaultValue={option.value}
                          onChange={handleCheckType}
                          type="checkbox"
                          className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                          checked={option.checked}
                        />
                        <label
                          htmlFor={`price-${optionIdx}`}
                          className="ml-3 min-w-0 flex-1 text-gray-600"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
              <div className="grid grid-cols-1 gap-y-10 auto-rows-min md:grid-cols-2 md:gap-x-6">
                <fieldset>
                  <legend className="block font-medium">Transaction</legend>
                  <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                    {filters.transaction.map((option, optionIdx) => (
                      <div
                        key={option.value}
                        className="flex items-center text-base sm:text-sm"
                      >
                        <input
                          id={`transaction-${optionIdx}`}
                          name="transaction[]"
                          defaultValue={option.value}
                          type="checkbox"
                          onChange={handleCheckTransaction}
                          className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                          checked={option.checked}
                        />
                        <label
                          htmlFor={`transaction-${optionIdx}`}
                          className="ml-3 min-w-0 flex-1 text-gray-600"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
                {/* <fieldset>
                  <legend className="block font-medium">Price</legend>
                  <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                    <main className="text-red-800">
                      <RangeSlider
                        initialMin={2500}
                        initialMax={7500}
                        min={0}
                        max={10000}
                        step={100}
                        priceCap={1000}
                      />
                    </main>
                  </div>
                </fieldset> */}
              </div>
            </div>
          </Disclosure.Panel>
          <div className="col-start-1 row-start-1 py-4">
            <div className="flex justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Menu as="div" className="relative inline-block">
                <div className="flex">
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option: any) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <button
                              onClick={() => handleClickSorting(option.value)}
                              type="button"
                              className={classNames(
                                option.current
                                  ? "font-medium text-gray-900"
                                  : "text-gray-500",
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm",
                              )}
                            >
                              {option.name}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </Disclosure>

        {/* Product grid */}
        <section
          aria-labelledby="products-heading"
          className="max-w-7xl mx-auto overflow-hidden sm:px-6 lg:px-8"
        >
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="-mx-px border-l border-gray-200 grid grid-cols-2 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
            {users.map((product: any, i: number) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                className="group relative p-4 border-r border-b border-gray-200 sm:p-6"
              >
                <div className="rounded-lg overflow-hidden bg-gray-200 aspect-w-1 aspect-h-1 group-hover:opacity-75">
                  <img
                    src={product.thumbnail_url}
                    alt={product.thumbnail_url}
                    className="w-full h-full object-center object-cover"
                  />
                </div>
                <div className="pt-10 pb-4 text-center">
                  <h3 className="text-sm font-medium text-gray-900">
                    <a href={product.url} rel="noreferrer" target="_blank">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.title}
                    </a>
                  </h3>
                  <div className="mt-3 flex flex-col items-center">
                    <p className="sr-only"> out of 5 stars</p>
                    <div className="flex items-center">
                      <p className="mt-1 text-md text-gray-500">
                        {product.city}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      <strong>Type :</strong> {Capitalize(product.type)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      <strong>Transaction :</strong>{" "}
                      {Capitalize(product.transaction)}
                    </p>
                  </div>
                  <p className="mt-4 text-base font-medium text-gray-900">
                    {product.price} DH
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer aria-labelledby="footer-heading" className="bg-white">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
      </footer>
    </div>
  );
}
