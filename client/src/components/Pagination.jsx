import PropTypes from 'prop-types';
import {Button, Flex, IconButton} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import chevronLeft from "@iconify/icons-fa6-solid/chevron-left";
import chevronRight from "@iconify/icons-fa6-solid/chevron-right";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pages = [...Array(totalPages).keys()].map(i => i + 1);

  const handleClick = (page, event) => {
    event.preventDefault();
    onPageChange(page);
  };

  return (
    <Flex as="nav" m={4} aria-label="Navigation de page" justifyContent="center" alignItems="center" gap={2}>
      <IconButton
        aria-label="Page précédente"
        icon={<Icon icon={chevronLeft} />}
        onClick={(event) => handleClick(currentPage - 1, event)}
        isDisabled={currentPage === 1}
        _hover={{ bg: "gray.100" }}
      />
      {pages.map((page) => (
        <Button
          key={page}
          onClick={(event) => handleClick(page, event)}
          variant={currentPage === page ? "solid" : "outline"}
          colorScheme={currentPage === page ? "blue" : "gray"}
          bg={currentPage === page ? "gray.900" : "white"}
          _hover={{
            bg: currentPage === page ? "gray.600" : "gray.100",
          }}
        >
          {page}
        </Button>
      ))}
      <IconButton
        aria-label="Page suivante"
        icon={<Icon icon={chevronRight} />}
        onClick={(event) => handleClick(currentPage + 1, event)}
        isDisabled={currentPage === totalPages}
        _hover={{ bg: "gray.100" }}
      />
    </Flex>
  );
};

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;