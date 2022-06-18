import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useDeletePostMutation } from '../generated/graphql';

interface EditDeletePostButtonsProps {
  id: number;
}

function EditDeletePostButtons({ id }: EditDeletePostButtonsProps) {
  const [deletePost] = useDeletePostMutation();

  return (
    <Box mb={1}>
      <NextLink href='/post/edit/[id]' as={`/post/edit/${id}`}>
        <IconButton
          as={Link}
          variant='solid'
          aria-label='edit post'
          mr={2}
          icon={<EditIcon />}
        />
      </NextLink>
      <IconButton
        variant='solid'
        aria-label='delete post'
        icon={
          <DeleteIcon
            onClick={() => {
              deletePost({
                variables: { id },
                update: (cache) => {
                  cache.evict({ id: 'Post' + id });
                },
              });
            }}
          />
        }
      />
    </Box>
  );
}

export default EditDeletePostButtons;
