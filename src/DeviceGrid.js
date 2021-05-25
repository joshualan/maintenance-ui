import React, { useState } from "react";

const DeviceGrid = () => {
  const [tenants, setTenants] = useState([]);
  const [sites, setSites] = useState([]);
  const [devices, setDevices] = useState([]);
  
  return (
    <h1> This is the device grid.</h1>
  );
};

export default DeviceGrid;