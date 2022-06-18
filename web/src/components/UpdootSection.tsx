import { ApolloCache } from '@apollo/client';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import gql from 'graphql-tag';
import React from 'react';
import { useVoteMutation, VoteMutation } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

interface UpdootProps {
  postId: number;
  points: number;
  voteStatus: number | null | undefined;
}

function UpdootSection({ postId, points, voteStatus }: UpdootProps) {
  const [vote] = useVoteMutation();

  const updateAfterVote = (
    value: number,
    postId: number,
    cache: ApolloCache<VoteMutation>
  ) => {
    const data = cache.readFragment<{
      id: number;
      points: number;
      voteStatus: number | null;
    }>({
      id: 'Post:' + postId,
      fragment: gql`
        fragment _ on Post {
          id
          points
          voteStatus
        }
      `,
    });

    if (data) {
      if (data.voteStatus === value) {
        return;
      }

      const newPoints =
        (data!.points as number) + (!data.voteStatus ? 1 : 2) * value;
      cache.writeFragment({
        id: 'Post:' + postId,
        fragment: gql`
          fragment _ on Post {
            points
            voteStatus
          }
        `,
        data: { id: postId, points: newPoints, voteStatus: value },
      });
    }
  };

  return (
    <Flex
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      mr={4}
    >
      <IconButton
        variant='solid'
        colorScheme={voteStatus === 1 ? 'green' : undefined}
        aria-label='updoot post'
        mb={1}
        icon={
          <ChevronUpIcon
            onClick={() => {
              if (voteStatus !== 1) {
                vote({
                  variables: { value: 1, postId },
                  update: (cache) => updateAfterVote(1, postId, cache),
                });
              }
            }}
          />
        }
      />
      {points}
      <IconButton
        variant='solid'
        colorScheme={voteStatus === -1 ? 'red' : undefined}
        aria-label='downdoot post'
        mt={1}
        icon={
          <ChevronDownIcon
            onClick={() => {
              if (voteStatus !== -1) {
                vote({
                  variables: { value: -1, postId },
                  update: (cache) => updateAfterVote(-1, postId, cache),
                });
              }
            }}
          />
        }
      />
    </Flex>
  );
}

export default withApollo({ ssr: false })(UpdootSection);
