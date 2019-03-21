import React from "react";
import { slugify } from "underscore.string";

import Layout from "./Layout";
import FilterableDataList from "./FilterableDataList";
import { getRegion } from "../queries/region";
import { getRegionPosts } from "../queries/post";
import { getRegionPlaces } from "../queries/place";
import PostList from "./PostList";
import Banner from "./Banner";
class RegionPage extends React.Component {
  render() {
    const { posts, region, places } = this.props;
    const {
      region: regionName,
      regionNorthEastLat,
      regionNorthEastLng,
      regionSouthWestLat,
      regionSouthWestLng,
      country,
      countryCode,
      id
    } = region;
    const breadcrumbLinks = [
      { href: "/", text: "Home" },
      {
        href: `/country?countryCode=${countryCode}`,
        as: `/country/${countryCode}`,
        text: country
      },
      {
        href: `/region?regionCode=${id}`,
        as: `/region/${slugify(country)}/${id}`,
        text: regionName,
        active: true
      }
    ];
    return (
      <Layout
        title={`Stravell | ${regionName}`}
        description={`Travel articles about ${regionName}`}
      >
        <Banner
          imageUrl={`https://source.unsplash.com/1026x405/?${regionName}`}
          place={regionName}
          placeSuggestions={[country]}
        />
        <div className="content-container">
          <FilterableDataList
            DataList={PostList}
            data={posts}
            noDataText={`There is no post about ${regionName} yet.`}
            googleMapsProps={{
              isMarkerShown: true,
              places,
              northEastLat: regionNorthEastLat,
              northEastLng: regionNorthEastLng,
              southWestLat: regionSouthWestLat,
              southWestLng: regionSouthWestLng
            }}
            breadCrumbProps={{
              links: breadcrumbLinks
            }}
          />
        </div>
      </Layout>
    );
  }
}

RegionPage.getInitialProps = async function({ query }) {
  const { regionCode } = query;
  const region = await getRegion(regionCode);
  const posts = await getRegionPosts(regionCode);
  const places = await getRegionPlaces(regionCode);
  return { posts, region, places };
};

export default RegionPage;
