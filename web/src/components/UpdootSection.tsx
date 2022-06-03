import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React from 'react';
import { useVoteMutation } from '../generated/graphql';

interface UpdootProps {
  postId: number;
  points: number;
  voteStatus: number | null | undefined;
}

function UpdootSection({ postId, points, voteStatus }: UpdootProps) {
  const [, vote] = useVoteMutation();
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
                vote({ value: 1, postId });
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
                vote({ value: -1, postId });
              }
            }}
          />
        }
      />
    </Flex>
  );
}

export default UpdootSection;
