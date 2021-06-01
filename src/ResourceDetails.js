import React from "react";
import { useParams } from "react-router";

const ResourceDetails = () => {
  let {tenantID, siteID, resourceID } = useParams();

  return <h2> hi {tenantID} lololol {siteID} omg {resourceID} wtf </h2>;
};

export default ResourceDetails;
