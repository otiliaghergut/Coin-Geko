import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Table from "../components/table";
import { getCoinDetails } from "../services/api";
import { Form, Button } from "react-bootstrap";
import { searchCoin } from "../services/api";

const Details = () => {
  const { id } = useParams();
  const [details, setDetails] = useState({});
  const [search, setSearch] = useState([]);

  const tick = useRef()

  useEffect(() => {
    fetchData(id)
  }, []);

  const fetchData = (coinId) => {
    getCoinDetails(coinId).then((res) => {
      if (res.status === 200) {
        const data = {
          logo: res.data.image.small,
          name: res.data.name,
          symbol: res.data.symbol,
          hashing: res.data.hashing_algorithm,
          description: res.data.description.en,
          marketCapEur: res.data.market_data.market_cap.eur,
          homepage: res.data.links.homepage,
          genesisDate: res.data.genesis_date,
        };
        setDetails(data);
      }
    });
  }

  const handleSearchCoin = (e) => {
    if (tick.current) return;
    tick.current = setTimeout(() => {
      clearInterval(tick.current);
      tick.current = undefined;
      searchCoin(e.target.value)
        .then(res => {
          if (res.status === 200) {
            setSearch(res.data.coins)
          }
        })
    }, 2000)
  }

  const handleSelectSearched = (selectedId) => {
    fetchData(selectedId);
    setSearch([])
  }

  const tableHeader = [
    {
      title: "Hashing algorithm",
      objKey: "hashing",
    },
    {
      title: "Market Cap in Euro",
      objKey: "marketCapEur",
    },
    {
      title: "Genesis Date",
      objKey: "genesisDate",
    },
  ];

  return (
    <div className="m-3">
      <Link to="/">Home</Link>
      <div className="d-flex mb-3">
        <img src={details.logo} alt="logo"></img>
        <h1>{details.name}</h1>
      </div>
      <hr />
      <div style={{position: "relative", width: "fit-content"}}>
        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
            style={{ maxWidth: '15rem' }}
            onChange={handleSearchCoin}
          />
        </Form>
        {search.length > 0 && <ul className="details-search-list">
          {search.map(item => (
            <li key={item.id} onClick={() => handleSelectSearched(item.id)}>{item.name}</li>
          ))}
        </ul>}
      </div>
      {/* <p dangerouslySetInnerHTML={{ __html: details.description }}></p> */}
      <iframe
        sandbox=""
        srcDoc={details.description}
        className="w-100"
        style={{ minHeight: "20rem" }}
      ></iframe>
      <Table header={tableHeader} body={[details]} />
      <ul>
        {details?.homepage?.map(
          (link, index) =>
            link !== "" && (
              <li key={link + index}>
                <a href={link}>{link}</a>
              </li>
            )
        )}
      </ul>
    </div>
  );
};

export default Details;
