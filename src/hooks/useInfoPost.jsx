import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPost } from "../lensQueries/getPost";
import { getPostComments } from "../lensQueries/getPostComments";
import { useQuery } from "react-query";

const useInfoPost = () => {
  let { idpost } = useParams();

  const { data: infoPost, isLoading } = useQuery(["postDetail", idpost], () =>
    getPost(idpost)
  );

  const [infoComments, setInfoComments] = useState([]);
  const [lastComments, setLastComments] = useState([]);
  const [page, setPage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const response = await getPost(idpost);
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const initPost = async () => {
      try {
        const response = await getPostComments(idpost, page);
        setInfoComments(response.data?.publications);
      } catch (error) {
        console.log(error);
      }
    };
    initPost();
  }, [page]);

  const loadMore = () => {
    setPage(infoComments?.pageInfo?.next);
    setLastComments([...lastComments, ...infoComments?.items]);
  };

  return {
    infoPost,
    infoComments,
    lastComments,
    navigate,
    loadMore,
  };
};

export default useInfoPost;
