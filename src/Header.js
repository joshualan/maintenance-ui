import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
  Avatar
} from "@progress/kendo-react-layout";
import { Badge, BadgeContainer } from "@progress/kendo-react-indicators";

let edAvatar =
  "https://media-exp3.licdn.com/dms/image/C4D03AQGNHCbhjTLNRQ/profile-displayphoto-shrink_200_200/0/1516275449454?e=1629331200&v=beta&t=LVgmJ_zpsbZGYRsY6OeltWocprkzJK-CSzLQjJSl5cs";
const Header = (props) => {
  const { page } = props;
  return (
    <div className="appbar">
      <AppBar themeColor="inherit">
        <AppBarSection>
          {/* <button className="k-button k-button-clear"> */}
            {/* <span className="k-icon k-i-menu" /> */}
            <img src="https://progresssoftware.sharepoint.com/sites/MyProgress-Marketing/Shared%20Documents/Progress%20Corporate%20Logo/Digital%20-%20RGB/Primary%20Logos%20&%20Symbol%20-%20Color/PNG/Progress_PrimarySymbol.png" style={{"max-width": "40px", "padding": "0px", "margin": "0px"}} />
          {/* </button> */}
        </AppBarSection>
        <AppBarSection>
          <Link to="/" className="header-link">
            <h1 className="title">WhatsUp Gold PoC</h1>
          </Link>
        </AppBarSection>

        <span className="k-appbar-separator" />

        <AppBarSection>
          <h1 className="title">{page}</h1>
        </AppBarSection>

        <AppBarSpacer />

        {/* "k-icon k-i-question" */}

        <AppBarSection >
          <button className="k-button k-button-clear">
            <BadgeContainer>
              <span className="k-icon k-i-question" />
              <Badge
                shape="dot"
                themeColor="info"
                size="small"
                position="inside"
              />
            </BadgeContainer>
          </button>
        </AppBarSection>

        <span className="k-appbar-separator" />

        <AppBarSection>
          <Avatar shape="circle" type="image">
            <img src={edAvatar} />
          </Avatar>
        </AppBarSection>
      </AppBar>
    </div>
  );
};

export default Header;
