import { useState, useEffect, useRef } from "react";
import Pagination from "../components/pagination";
import Table from "../components/table";
import { getCoinsMarket } from "../services/api";
import { debounce } from "../services/utils";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const storedData = localStorage.getItem("GeckoPageNo");
  const storedPage = storedData ? Number(storedData) : 1;
  const [coins, setCoins] = useState([]);
  const [page, setPage] = useState(storedPage);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const tick = useRef();
  const pagRef = useRef();

  const pageQty = 10;
  useEffect(() => {
    setLoading(true);
    clearInterval(tick.current);
    tick.current = setInterval(() => {
      fetchData();
    }, 10000);
    fetchData();
   
    return () => clearInterval(tick.current);
  }, [page]);

  const fetchData = () => {
    getCoinsMarket(pageQty, page).then((res) => {
      if (res.status === 200) {
        // console.log(res);
        const data = res.data.map((item) => {
          return {
            id: item.id,
            image: item.image,
            name: item.name,
            symbol: item.symbol,
            currentPrice: item.current_price,
            high24: item.high_24h,
            low24: item.low_24h,
          };
        });
        setCoins(data);
        setLoading(false);
      } else {
        // console.log("Error");
      }
    });
  };

  const handleNextPage = () => {
    setPage((state) => {
      localStorage.setItem("GeckoPageNo", state + 1);
      return state + 1
    });
  };

  const handlePrevPage = () => {
    setPage((state) => {
      localStorage.setItem("GeckoPageNo", state - 1);
      return state - 1
    });
  };

  const handleRedirect = (id) => {
    navigate(`/details/${id}`);
  };

  const tableColumns = [
    {
      title: "Image",
      objKey: "image",
      type: "image",
    },
    {
      title: "Name",
      objKey: "name",
      type: "text",
    },
    {
      title: "Symbol",
      objKey: "symbol",
      type: "text",
    },
    {
      title: "Current Price",
      objKey: "currentPrice",
      type: "text",
    },
    {
      title: "High 24 Hour Price",
      objKey: "high24",
      type: "text",
    },
    {
      title: "Low 24 Hour Price",
      objKey: "low24",
      type: "text",
    },
  ];

  return (
    <div className="m-4">
      <Table header={tableColumns} body={coins} onRowClick={handleRedirect} />
      <div className="d-flex justify-content-center" ref={pagRef}>
        {" "}
        <Pagination
          disableButtons={loading}
          onClickPrev={() => debounce(handlePrevPage)}
          onClickNext={() => debounce(handleNextPage)}
          pageNo={page}
        />
      </div>
    </div>
  );
};

export default Home;
