import React from "react";
import { Box, Text, Button } from "grommet";
import * as Icons from "grommet-icons";

import Container from "../components/Container";

const TumblrPost = () => (
  <Box
    round="small"
    border={{ color: "brand", size: "small" }}
    // elevation="small"
    margin={{ bottom: "small" }}
    pad="medium"
  />
);

const TwitterPost = ({ post }) => (
  <Box
    round="small"
    border={{ color: "#08a0e9", size: "small" }}
    // background="#08a0e9"
    margin={{ bottom: "small" }}
    pad="medium"
    direction="row"
    gap="small"
    justify="between"
  >
    <Box gap="small" direction="row">
      <Icons.Twitter color="#08a0e9" />
      <Box gap="small">
        <Box gap="xxsmall">
          <Text weight="bold" color="#08a0e9">
            {post.metadata.username}
          </Text>
          <Text size="small">
            {new Date(Number(post.timestamp)).toUTCString()}
          </Text>
        </Box>
        <Text>{post.content}</Text>
        <Button
          label="Goto Post"
          alignSelf="start"
          icon={<Icons.LinkNext />}
          href={post.url}
          target="_blank"
          reverse
        />
      </Box>
    </Box>
  </Box>
);

const Posts = ({ posts }) => {
  console.log(posts);
  return (
    <Container>
      {posts.map((post, i) => (
        <Box key={`post-${i}`}>
          {post.value.source === "twitter" && <TwitterPost post={post.value} />}
          {post.value.source === "tumblr" && <TumblrPost post={post.value} />}
        </Box>
      ))}
    </Container>
  );
};

export default Posts;
