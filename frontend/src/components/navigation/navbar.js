import React from "react";
import {
  Flex,Text
} from "@chakra-ui/react";
import {
    Link
  
}from "react-router-dom"

const Nav = ({children}) => {
    return (
      <Flex
        direction="row"
        padding="0.5vw"
        justifyContent="space-between"
        alignItems="center"
      >
        <Link to="/login">
          <Text paddingLeft="1vw" fontSize="3xl">Example.com</Text>
        </Link>
        <Flex direction="row">{children}</Flex>
      </Flex>
    );
}


export default Nav;