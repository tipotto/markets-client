/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import KeyboardArrowUpOutlinedIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
import clsx from "clsx";
import InfiniteScroll from "react-infinite-scroller";
import ScrollUpButton from "react-scroll-up-button";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import MenuItem from "@material-ui/core/MenuItem";
import Pagination from "@material-ui/lab/Pagination";
import tabOptionsObject from "../../constants/TabOptions";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
// import Item from "../organisms/Item";
import ItemList from "../organisms/ItemList";
import VirtualizedList from "../organisms/VirtualizedList";
import Form from "../organisms/Form";
import FormData from "../../constants/FormData";
import AdditionalSearchButton from "../molecules/AdditionalSearchButton";
import {
  requestSearch,
  loadItems,
  changeItemType,
  resetLoadedItems,
  addFavoriteItem,
  deleteFavoriteItem,
} from "../../actions";
import { LOAD_ITEM_NUMBER, spliceArray } from "../../actions/function";
import { platformArray } from "../../constants/SelectOptions";
import commonStyles from "../../style/common";
import topStyles from "../../style/top";

// const scrollUpWindow = () => {
//   const speed = 2000;
//   const position = $("#result").offset().top;
//   $("body,html").animate({ scrollTop: position }, speed, "swing");
//   // $("body,html").animate({ scrollTop: "-=1000px" }, speed, "swing");
// };

export const useReferredState = (initialValue) => {
  const [state, setState] = useState(initialValue);
  const reference = useRef(state);

  const setReferredState = (value) => {
    reference.current = value;
    setState(value);
  };

  return [reference, setReferredState];
};

const useMain = () => {
  const { common, loading, loadingText } = topStyles();
  const dispatch = useDispatch();
  // const [selectedPlatform, setSelectedPlatform] = useState("mercari");
  const [page, setPage] = useReferredState(1);
  const [formValues, setFormValues] = useReferredState(null);
  const allItems = useSelector((state) => state.search.items.all);
  // const restItems = useSelector((state) => state.search.items.all.rest);
  const favoriteItems = useSelector((state) => state.search.items.favorites);
  const isLoading = useSelector((state) => state.state.isLoading);
  const selectedTab = useSelector((state) => state.search.selectedTab);

  // const _loadMore = () => {
  //   console.log("_loadMore");
  //   if (selectedTab !== "all") return;

  //   const items = spliceArray(restItems);
  //   dispatch(loadItems(items));
  // };

  const _getItemsByType = () => {
    if (selectedTab === "all") return allItems;
    if (selectedTab === "favorites") return favoriteItems;
    return [];
  };

  const handleCategoryChange = (event, newValue) => {
    console.log("tab value", newValue);
    dispatch(changeItemType(newValue));

    // if (newValue === "all" && loadedItems.length > LOAD_ITEM_NUMBER) {
    //   const items = spliceArray([...loadedItems, ...restItems]);
    //   dispatch(resetLoadedItems(items));
    // }
  };

  // const handlePlatformChange = (event, platform) => {
  //   console.log("platform", platform);
  //   // console.log("platform", event.target.value);
  //   setSelectedPlatform(platform);
  // };

  const handleFavorite = useCallback((event, value) => {
    console.log("handleFavorite", value);
    if (value.isFavorite) {
      dispatch(addFavoriteItem(value));
    } else {
      dispatch(deleteFavoriteItem(value));
    }
  }, []);

  const handleFormValues = useCallback((value) => {
    console.log("value", value);
    setFormValues(value);
  }, []);

  const handleAdditionalSearch = useCallback((event, value) => {
    console.log("formValues", formValues);
    console.log("value", value);
    setPage(value);

    const newValue = { ...formValues.current, page: value };
    console.log("newValue", newValue);

    setFormValues(newValue);
    dispatch(requestSearch(FormData.SEARCH, newValue));
  }, []);

  const _renderItems = () => {
    const items = _getItemsByType();
    console.log("renderItems", items);

    if (!items.length) return [];

    return <VirtualizedList results={items} handleFavorite={handleFavorite} />;
  };

  const setContent = () => {
    console.log("setContent");

    if (isLoading) {
      return (
        <div className={loading}>
          <CircularProgress color="secondary" />
          <span className={clsx(loadingText, common)}>
            ただいま検索しています...
          </span>
        </div>
      );
    }

    if (!isLoading && !allItems.length) {
      return (
        <div className={loading}>
          <span className={clsx(loadingText, common)}>
            検索結果はありません。
          </span>
        </div>
      );
    }

    return _renderItems();
  };

  return {
    page,
    formValues,
    selectedTab,
    // selectedPlatform,
    // formData,
    handleCategoryChange,
    // handlePlatformChange,
    handleFormValues,
    handleAdditionalSearch,
    setContent,
  };
};

const Main = (props) => {
  const {
    page,
    formValues,
    selectedTab,
    // selectedPlatform,
    // formData,
    handleCategoryChange,
    // handlePlatformChange,
    handleFormValues,
    handleAdditionalSearch,
    setContent,
  } = useMain();
  // } = useMain(rootElement, scrollTotal);
  const { wrapper } = props.classes;
  const {
    common,
    main,
    serviceName,
    title,
    siteDescription,
    formContainer,
    sectionTitle,
    sectionDescription,
    resultContainer,
    resultHeader,
    result,
    box,
    itemTypeSelect,
    tabs,
    tab,
    pagination,
    selectBox,
    // results,
    scrollUpBtn,
    showBtn,
    loading,
    loadingText,
    platformSelectGroup,
    platformSelectBtn,
  } = topStyles();

  console.log("Main");

  return (
    <>
      <Header />
      <div className={wrapper}>
        <div className={main}>
          <div>
            <h1 className={serviceName}>
              <span className={title}>フリマサイト検索</span>
              markets.jp
            </h1>
            <p className={clsx(siteDescription, common)}>
              複数のフリマサイトを一括検索し、商品を比較することができます。
            </p>
          </div>
          <div className={formContainer}>
            <h2 className={clsx(sectionTitle, common)}>検索フォーム</h2>
            <p className={clsx(sectionDescription, common)}>
              メルカリ、ラクマ、PayPayフリマに対応。豊富な検索オプションにより、精度の高い検索が可能です。
            </p>
            <Form form={FormData.SEARCH} handleFormValues={handleFormValues} />
          </div>
        </div>
        <div className={resultContainer}>
          <div className={clsx(main, result)}>
            <div id="result" className={resultHeader}>
              <h2 className={clsx(sectionTitle, common)}>あなたの検索結果</h2>
              <p className={clsx(sectionDescription, common)}>
                気に入った商品をクリックして、各フリマサイトですぐに購入できます。
              </p>
              <Box
                className={itemTypeSelect}
                sx={{ width: "100%", bgcolor: "background.paper" }}
              >
                <Tabs
                  className={tabs}
                  value={selectedTab}
                  onChange={handleCategoryChange}
                  variant="scrollable"
                  scrollButtons="on"
                  // allowScrollButtonsMobile
                  aria-label="scrollable force tabs example"
                  // centered
                >
                  <Tab className={tab} label="すべて" value="all" />
                  <Tab className={tab} label="お気に入り" value="favorites" />
                  {/* <Tab className={tab} label="人気アイテム" value="likes" /> */}
                  {/* {!restItems.length &&
                  TabOptions.platforms.map((platform) => (
                    <Tab
                      key={platform.value}
                      className={tabs}
                      label={platform.label}
                      value={platform.value}
                    />
                  ))} */}
                </Tabs>
                {/* {selectedTab === "all" && formValues.current && ( */}
                {selectedTab === "all" && (
                  <Pagination
                    className={pagination}
                    count={10}
                    size="large"
                    shape="rounded"
                    page={page.current}
                    onChange={handleAdditionalSearch}
                  />
                )}
                {/* {selectedTab === "likes" && (
                  <ToggleButtonGroup
                    className={platformSelectGroup}
                    exclusive
                    value={selectedPlatform}
                    onChange={handlePlatformChange}
                    aria-label="platform"
                  >
                    {tabOptionsObject.platforms.map((platform) => (
                      <ToggleButton
                        className={platformSelectBtn}
                        key={platform.value}
                        value={platform.value}
                        aria-label={platform.value}
                      >
                        {platform.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                )} */}
              </Box>
            </div>
          </div>
          <div>
            <div>{setContent()}</div>
          </div>
          {/* <AdditionalSearchButton
            formValues={formValues}
            handleAdditionalSearch={handleAdditionalSearch}
          /> */}
        </div>
      </div>
      <Footer />
      {/* <ScrollUpButton
        StopPosition={0}
        ShowAtPosition={1500}
        EasingType="easeOutCubic"
        AnimationDuration={1500}
        ContainerClassName={scrollUpBtn}
        TransitionClassName={showBtn}
      >
        <KeyboardArrowUpOutlinedIcon htmlColor="#fff" fontSize="large" />
      </ScrollUpButton> */}
    </>
  );
};

export default withStyles(commonStyles)(Main);
