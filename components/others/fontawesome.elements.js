import styled from "styled-components";

let config = {
  font_size: "16px",
  main_color: "#865fe9",
  margin: "0 7px 0 0",
};

export const ULawesome = styled.label`
  font-size: ${config["font_size"]};
  color: ${config["main_color"]};
  margin: ${config["margin"]};
  display: inline-block;
`;

export const ListALT = styled.label`
  font-size: 18px;
  color: ${config["main_color"]};
  margin: ${config["margin"]};
  display: inline-block;
`;
