import React, { useEffect, useState } from "react";
import { explorePublications } from "../lensQueries/explorePublications";
import CardImg from "./CardImg";

export default function ExplorePublications(props) {
  const [page, setPage] = useState('{"timestamp":1,"offset":0}');
  const [data, setData] = useState([]);
  const [lastImg, setLastImg] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedButton, setSelectedButton] = useState("LATEST");
  console.log(lastImg);
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      if (selectedButton) {
        try {
          const request = {
            sortCriteria: selectedButton, //You can filter by TOP_COMMENTED | TOP_COLLECTED | TOP_MIRRORED | LATEST
            noRandomize: true,
            sources: ["5bba5781-78b5-4927-8d2f-122742817583"],
            publicationTypes: ["POST"],
            cursor: page,
            limit: 24,
          };
          const response = await explorePublications(request); // To get next result replace the cursor with the value of response.pageInfo.next
          setData(response.data?.explorePublications);
          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      }
    };
    init();
  }, [selectedButton, page]);

  const handleClick = (button) => {
    setPage('{"timestamp":1,"offset":0}');
    setLastImg([]);
    setSelectedButton(button);
  };

  const loadMore = () => {
    setPage(data?.pageInfo?.next);
    setLastImg([...lastImg, ...data?.items]);
  };

  return (
    <div
      style={{ backgroundColor: "black", height: "100%", paddingBottom: 30 }}
    >
      <div style={{ marginLeft: 200, marginRight: 200 }}>
        <h1
          style={{
            textAlign: "center",
            marginTop: 0,
            paddingTop: 30,
            color: "white",
          }}
        >
          NomuLabs Challenge
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginBottom: 10,
          }}
        >
          <button
            style={{
              color: "white",
              padding: 10,
              borderRadius: 5,
              fontSize: 16,
              cursor: "pointer",
              backgroundColor: selectedButton === "LATEST" ? "grey" : "#123353",
            }}
            onClick={() => {
              handleClick("LATEST");
            }}
          >
            Date created
          </button>
          <button
            style={{
              color: "white",
              padding: 10,
              borderRadius: 5,
              fontSize: 16,
              cursor: "pointer",
              backgroundColor:
                selectedButton === "TOP_COMMENTED" ? "grey" : "#123353",
            }}
            onClick={() => {
              handleClick("TOP_COMMENTED");
            }}
          >
            Most mirrored
          </button>
          <button
            style={{
              color: "white",
              padding: 10,
              borderRadius: 5,
              fontSize: 16,
              cursor: "pointer",
              backgroundColor:
                selectedButton === "TOP_COLLECTED" ? "grey" : "#123353",
            }}
            onClick={() => {
              handleClick("TOP_COLLECTED");
            }}
          >
            Most collected
          </button>
        </div>

        {!data && <p style={{ fontSize: 50, color: "white" }}>Loading...</p>}
        {loading && <p style={{ fontSize: 50, color: "white" }}>Loading...</p>}

        {data === null ? (
          "Esta cargando ..."
        ) : (
          <div
            style={{
              backgroundColor: "wheat",
              padding: 15,
              paddingTop: 30,
              display: "grid",
              justifyItems: "center",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: 10,
            }}
          >
            {lastImg.concat(data?.items).map((data, index) => (
              <div key={index}>
                <CardImg data={data} />
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "0 auto",
          marginTop: 20,
          padding: 10,
          width: 400,
          textAlign: "center",
          background: "none",
          cursor: "pointer",
          color: "white",
          backgroundColor: "#1062dd",
          borderRadius: 5,
        }}
        onClick={loadMore}
      >
        Load more
      </button>
    </div>
  );
}
