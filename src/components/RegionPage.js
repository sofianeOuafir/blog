import React from "react";
import { slugify } from "underscore.string";

import Layout from "./Layout";
import FilterablePostList from "./FilterablePostList";
import PageHeader from "./PageHeader";
import { getRegion } from "../queries/region";
import { getRegionPosts } from "../queries/post";
import { getRegionPlaces } from "../queries/place";
import Place from "./Place";
import GoogleMaps from "./GoogleMaps";
import BreadCrumb from "./Breadcrumb";

class RegionPage extends React.Component {
  render() {
    const { posts, region, places } = this.props;
    const {
      regionNorthEastLat,
      regionNorthEastLng,
      regionSouthWestLat,
      regionSouthWestLng,
      country,
      countryCode,
      id
    } = region;
    const breadcrumbLinks = [
      { href: "/destinations", text: "Destinations" },
      {
        href: `/country?countryCode=${countryCode}`,
        as: `/country/${countryCode}`,
        text: country
      },
      {
        href: `/region?regionCode=${id}`,
        as: `/region/${slugify(country)}/${id}`,
        text: region.region
      }
    ];
    return (
      <Layout
        title={`Stravell | ${region.region}`}
        description={`Travel articles about ${region.region}`}
      >
        <PageHeader>
          <Place
            placeName={region.region}
            countryCode={country}
            placeNameClassName="h2 favourite-font-weight"
            flagSize="64"
          />
        </PageHeader>
        <div className="content-container">
          <BreadCrumb links={breadcrumbLinks} />
          <GoogleMaps
            isMarkerShown
            places={places}
            northEastLat={regionNorthEastLat}
            northEastLng={regionNorthEastLng}
            southWestLat={regionSouthWestLat}
            southWestLng={regionSouthWestLng}
          />
          <FilterablePostList
            posts={posts}
            withCountryFilter={false}
            noPostText={`There is no post about ${region.region} yet.`}
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
