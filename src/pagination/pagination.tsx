import React, { useEffect, useState } from "react";
import { paginationService } from "./pagination.service";
import axiosInstance from "../http/httpInstance";

/*
 * Type definitions
 */
interface Props {
  apiRoute: string;
  recordsPerPage: number;
  responseData: any;
  isLoadingData: any;
  reloadApi: boolean;
  search?: any;
  isSearchingData: any;
}

/*
 * Pagination with props
 */
export const Pagination = ({
  apiRoute,
  recordsPerPage = 10,
  responseData,
  isLoadingData,
  reloadApi,
  search,
  isSearchingData,
}: Props) => {
  // Hooks
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pager, setPager] = useState({} as any);
  const [totalRecordsPage, setTotalRecordsPage] = useState(0);
  let innerCurrentPage: number = 1;

  /*
   * Fetch data from API
   * Append query params if any
   * API call with GET
   */
  const getData = (pageNumber: number) => {
    isLoadingData(true);
    setCurrentPage(Number(pageNumber));

    let finalApiRoute = `${apiRoute}?pageNumber=${pageNumber}&recordsPerPage=${recordsPerPage}&searchTerm=${
      search.term || ""
    }`;
    axiosInstance
      .get(finalApiRoute)
      .then((response: any) => {
        isLoadingData(false);
        isSearchingData(false);
        setTotalCount(response.data.count);
        responseData(response.data.data);
        setTotalRecordsPage(Math.ceil(response.data.count / recordsPerPage));
        setPagination(response.data.count, pageNumber, recordsPerPage);
      })
      .catch((error) => {
        isLoadingData(false);
        isSearchingData(false);
      });
  };

  /*
   * Set pagination data and pager data
   */
  const setPagination = (
    totalCount: number,
    pageNumber: number,
    recordsPerPage: number
  ) => {
    const pData = paginationService.getPager(
      totalCount,
      pageNumber,
      recordsPerPage
    );
    setPager({ ...pData });
  };

  /*
   * Watch reloadApi flag
   */
  useEffect(() => {
    if (reloadApi) {
      getData(currentPage);
    }
  }, [reloadApi]);

  /*
   * Component initiated
   */
  useEffect(() => {
    getData(currentPage);
  }, []);

  /*
   * Watch current page
   */
  useEffect(() => {
    innerCurrentPage = currentPage;
  }, [currentPage]);

  /*
   * Watch search
   */
  useEffect(() => {
    if (search && search.term) {
      isSearchingData(true);
      getData(currentPage);
    }
  }, [search]);

  /*
   * Watch recordsPerPage
   */
  useEffect(() => {
    getData(currentPage);
  }, [recordsPerPage]);

  /*
   * Render
   */
  return (
    <div>
      {totalCount > 0 && (
        <div className="table-footer d-flex justify-content-between align-items-center">
          <div className="records-count d-sm-block d-none text-secondary">
            Showing {pager.startIndex + 1} to {pager.endIndex + 1} of{" "}
            {totalCount} records
          </div>
          <nav className="pages">
            <ul className="pagination">
              <li
                className={
                  currentPage === 1 ? "disabled page-item" : "page-item"
                }
              >
                <a
                  href="#!"
                  className="page-link"
                  onClick={(e) => {
                    e.preventDefault();
                    getData(innerCurrentPage);
                  }}
                >
                  Previous
                </a>
              </li>
              {pager.pages &&
                pager.pages.map((page: number, index: number) => {
                  return (
                    <li
                      key={index}
                      className={
                        currentPage === page
                          ? "custom-disabled active page-item"
                          : "page-item"
                      }
                    >
                      <a
                        className="page-link"
                        href="#!"
                        onClick={(e) => {
                          e.preventDefault();
                          getData(page);
                        }}
                      >
                        {page}
                      </a>
                    </li>
                  );
                })}
              <li
                className={
                  currentPage + 1 > totalRecordsPage
                    ? "disabled page-item"
                    : "page-item"
                }
              >
                <a
                  className="page-link"
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    getData(innerCurrentPage + 1);
                  }}
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};
