import {
  Container,
  Fab,
  Tooltip,
  Typography,
  Grid,
  LinearProgress,
  CircularProgress,
  Card,
  CardContent,
  Button,
} from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import styles from "./css/Items.module.css";
import ItemUpload from "./components/ItemUpload";
import { Gender, Item } from "./util/util-types";
import ItemCard from "./components/ItemCard";
import { connect } from "react-redux";
import { RootState } from "./store/rootReducer";
import {
  ItemsSliceState,
  patchDiscover,
  patchRecommended,
  patchGenderFilter,
  patchCategoryFilter,
  patchPage,
} from "./store/slices/itemsSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { arraysSetEquality, useTitle } from "./util/util-functions";
import { clothingTypes } from "./util/data";
import GenderFilterUI from "./components/Util/GenderFilterUI";

type OwnProps = {
  readonly loggedIn: boolean;
};
// Subscribed from Redux store.
type Props = OwnProps & {
  items: ItemsSliceState;
  dispatch: Dispatch;
};

const Items = ({ loggedIn, items, dispatch }: Props): ReactElement => {
  const [uploadHidden, setUploadHidden] = useState(true);
  const {
    discoverData,
    recommendedData,
    lastUpdated,
    currentGenderFilter,
    currentCategoryFilter,
    currentPage,
  } = items;
  const [genderFilter, setGenderFilter] = useState<Gender[]>(() => [
    "Men",
    "Women",
    "Unisex",
  ]);

  const [categoryFilter, setCategoryFilter] = useState("any");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const handleGenderFilter = (
    _: React.MouseEvent<HTMLElement>,
    genders: Gender[]
  ) => {
    setGenderFilter(genders);
  };

  useTitle("fitme | Items");

  useEffect(() => {
    if (
      !arraysSetEquality(genderFilter, currentGenderFilter) ||
      categoryFilter !== currentCategoryFilter ||
      page !== currentPage ||
      Date.now() - lastUpdated > 180000 ||
      (discoverData.length === 1 && discoverData[0]._id === "LOADING") ||
      (recommendedData.length === 1 && recommendedData[0]._id === "LOADING")
    ) {
      setLoading(true);
      const access_token = localStorage.getItem("access_token");
      const accessTokenString = `Bearer ${access_token}`;
      fetch(
        `/discover_items?gender=${genderFilter.toString()}&category=${categoryFilter}&page=${page.toString()}`,
        {
          method: "GET",
        }
      )
        .then((r) => r.json())
        .then((response) => {
          dispatch(patchDiscover(response.items as Item[]));
        });

      fetch(
        `/recommended_items?gender=${genderFilter.toString()}&category=${categoryFilter}`,
        {
          method: "GET",
          headers: {
            Authorization: loggedIn ? accessTokenString : "",
          },
        }
      )
        .then((r) => r.json())
        .then((response) => {
          dispatch(patchRecommended(response.items as Item[]));
          setLoading(false);
        });
      dispatch(patchGenderFilter(genderFilter));
      dispatch(patchCategoryFilter(categoryFilter));
      dispatch(patchPage(page));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genderFilter, categoryFilter, page]);

  if (
    discoverData.length === 1 &&
    recommendedData.length === 1 &&
    (discoverData[0]._id === "LOADING" || recommendedData[0]._id === "LOADING")
  ) {
    return <LinearProgress />;
  } else {
    return (
      <>
        <Container className={styles.container} maxWidth="md">
          {loggedIn && (
            <div className={styles.topBox}>
              <Tooltip
                title={uploadHidden ? "Upload a new item" : "Close editor"}
                aria-label="Upload a new item"
              >
                <Fab
                  onClick={() => {
                    setUploadHidden(!uploadHidden);
                  }}
                  className={styles.fab}
                  color="primary"
                  aria-label={uploadHidden ? "add" : "close"}
                >
                  {uploadHidden ? <AddIcon /> : <CloseIcon />}
                </Fab>
              </Tooltip>
              {!uploadHidden && (
                <ItemUpload setUploadHidden={setUploadHidden} />
              )}
            </div>
          )}
          <div className={styles.topExplanation}>
            <Typography>
              {!loggedIn &&
                "Log in to get personalized recommendations and upload your own items!"}
            </Typography>
          </div>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="h4">Filter</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>
                        <u>Category</u>
                      </Typography>
                    </Grid>
                    {categoryFilter !== "any" && (
                      <Grid item xs={12}>
                        <b
                          style={{ cursor: "pointer", color: "gray" }}
                          onClick={(e) => {
                            setCategoryFilter("any");
                          }}
                        >
                          <u>Clear filter</u>
                        </b>
                      </Grid>
                    )}
                    {clothingTypes.map((category) => {
                      return (
                        <Grid item xs={12} key={category}>
                          <b
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              setCategoryFilter(category);
                            }}
                          >
                            {category === categoryFilter && "> "}
                            {category}
                          </b>
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={9}>
              {loading ? (
                <CircularProgress />
              ) : (
                <GenderFilterUI
                  genderFilter={genderFilter}
                  handleGenderFilter={handleGenderFilter}
                />
              )}
              <div className={styles.recommended}>
                <div style={{ marginTop: "5px", marginBottom: "5px" }}>
                  <Typography variant="h3">
                    <b>Recommended</b>
                  </Typography>
                </div>

                <Grid container alignItems="stretch" spacing={1}>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    recommendedData.map((it) => {
                      return (
                        <Grid
                          item
                          xs={12}
                          md={4}
                          key={it._id}
                          style={{ display: "flex" }}
                        >
                          <ItemCard item={it} />
                        </Grid>
                      );
                    })
                  )}
                </Grid>
              </div>
              <div className={styles.discover}>
                <div style={{ marginTop: "5px", marginBottom: "5px" }}>
                  <Typography variant="h3">
                    <b>Discover</b>
                  </Typography>
                </div>
                <Grid container alignItems="stretch" spacing={1}>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    discoverData.map((it) => {
                      return (
                        <Grid
                          item
                          xs={12}
                          md={4}
                          key={it._id}
                          style={{ display: "flex" }}
                        >
                          <ItemCard item={it} />
                        </Grid>
                      );
                    })
                  )}
                </Grid>
              </div>
            </Grid>
          </Grid>
          <div className={styles.pageNav}>
            {page > 1 && (
              <Button
                variant="contained"
                onClick={() => setPage(page - 1)}
                className={styles.pageNavButton}
              >
                {page - 1}
              </Button>
            )}
            <Button
              variant="contained"
              className={styles.pageNavButton}
              disabled
            >
              {page}
            </Button>
            {discoverData.length === 15 && (
              <Button
                variant="contained"
                onClick={() => setPage(page + 1)}
                className={styles.pageNavButton}
              >
                {page + 1}
              </Button>
            )}
          </div>
        </Container>
      </>
    );
  }
};

const Connected = connect(({ items }: RootState) => ({ items }))(Items);
export default Connected;
