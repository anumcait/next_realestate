import { useEffect, useState } from "react";
import { Flex, Select, Box, Text, Input, Spinner, Icon, Button } from '@chakra-ui/react';
import { useRouter } from "next/router";
import { MdCancel } from 'react-icons/md';
import Image from 'next/image';
import { baseUrl, fetchApi } from '../utils/fetchApi';
import { filterData, getFilterValues } from "@/utils/filterData";

import noresult from '../assets/images/noresult.svg';

const SearchFilters = () => {
    const [filters, setFilters] = useState(filterData);
    const [showLocations, setShowLocations] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [locationData, setLocationData] = useState();

    const router = useRouter();

    const searchProperties = (filterValues) => {
        const path = router.pathname;
        const { query } = router;

        const values = getFilterValues(filterValues);

        values.forEach((item) => {
            if (item.value && filterValues?.[item.name]) {
                query[item.name] = item.value;
            }
        });

        router.push({ pathname: path, query });
    };

    useEffect(() => {
        if (searchTerm !== '') {
            const fetchData = async () => {
                setLoading(true);
                const data = await fetchApi(`${baseUrl}/auto-complete?query=${searchTerm}`);
                setLoading(false);
                setLocationData(data?.hits);
            };
            fetchData();
        }
    }, [searchTerm]);

    const resetFilters = () => {
        setFilters(filterData); // Reset filters to initial values
        setSearchTerm(''); // Clear the search term
        setShowLocations(false); // Hide the locations box
        setLocationData([]); // Clear location data
        router.push({ pathname: router.pathname }); // Clear query parameters
    };

    return (
        <Flex bg='gray.100' p='4' justifyContent='center' flexWrap='wrap'>
            {filters?.map((filter) => (
                <Box key={filter.queryName}>
                    <Select
                        onChange={(e) => searchProperties({ [filter.queryName]: e.target.value })}
                        placeholder={filter.placeholder}
                        w='fit-content'
                        p='2'
                    >
                        {filter?.items?.map((item) => (
                            <option value={item.value} key={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </Select>
                </Box>
            ))}
            <Flex flexDir='column'>
                <Button onClick={() => (setShowLocations(!showLocations))} border='1px' borderColor='gray.200' marginTop='2'>
                    Search By Location
                </Button>
                {showLocations && (
                    <Flex flexDir='column' pos='relative' paddinTop='2'>
                        <Input
                            placeholder='Type Here'
                            value={searchTerm}
                            w='300px'
                            focusBorderColor='gray.300'
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm !== '' && (
                            <Icon
                                as={MdCancel}
                                pos='absolute'
                                cursor='pointer'
                                right='5'
                                top='5'
                                zIndex='100'
                                onClick={() => setSearchTerm('')}
                            />
                        )}
                        {loading && <Spinner margin='auto' marginTop='3' />}
                        {showLocations && (
                            <Box height='300px' overflow='auto'>
                                {locationData?.map((location) => (
                                    <Box
                                        key={location.id}
                                        onClick={() => {
                                            searchProperties({ lcoationExternalIDs: location.externalID });
                                            setShowLocations(false);
                                            setSearchTerm(location.name);
                                        }}
                                    >
                                        <Text cursor='pointer' bg='gray.200' p='2' borderBottom='1px' borderColor='gray.100'>
                                            {location.name}
                                        </Text>
                                    </Box>
                                ))}
                                {!loading && !locationData?.length && (
                                    <Flex justifyContent='center' alignItems='center' flexDir='column'>
                                        <Image src={noresult} />
                                        <Text fontSize='xl' marginTop='3'>
                                            Waiting to Search!
                                        </Text>
                                    </Flex>
                                )}
                            </Box>
                        )}
                    </Flex>
                )}
            </Flex>
            <Button bg='blue.900' color='white' marginTop='2' onClick={resetFilters}>
                Reset Filter
            </Button>
        </Flex>
    );
};

export default SearchFilters;
