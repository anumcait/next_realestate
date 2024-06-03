import { useState } from "react";
import {useRouter} from "next/router";
import Image from "next/image";
import { Flex, Box, Text, Icon } from "@chakra-ui/react";
import {BsFilter} from 'react-icons/bs';
import SearchFilters from "@/components/searchFilters";
import noresult from '../assets/images/noresult.svg'
import { fetchApi,baseUrl } from "@/utils/fetchApi";
import Property from "@/components/Property";
const Search = ({properties}) => {

    const [searchFilters, setSearchFilter] = useState(false);
    const router = useRouter();

    return(
        <Box>
            <Flex
            cursor='pointer'
            bg='gray.300'
            borderBottom='1px'
            borderColor='gray.200'
            p='2'
            fontweight='black'
            fontSize='lg'
            justifyContent='center'
            alignItems='center'
            onClick={()=>setSearchFilter((prevFilter)=>!prevFilter)}
            >
                <Text>Search property by filter</Text>
                <Icon margin='2' w='7' as ={BsFilter}/>
            </Flex>
            {searchFilters && <SearchFilters />}
            <Text fontSize='2xl' p='4' fontWeight='bold'>
                Poperties {router.query.purpose}
            </Text>
            <Flex wrap='wrap'>
            {properties && properties.length > 0 ? (
          properties.map((property) => (
            <Property property={property} key={property.id} />
          ))
        ) : (
          <Flex justifyContent='center' alignItems='center' flexDir='column' marginTop='5' marginBottom='5'>
            <Image src={noresult} />
            <Text fontSize='xl' marginTop='3'>No Result Found.</Text>
          </Flex>
        )}
            </Flex>

        </Box>
    )

}

export async function getServerSideProps({query}){
    const purpose = query.purpose || 'for-rent';
    const rentFrequency = query.rentFrequency||'Yearly';
    const minPrice = query.minPrice||'0';
    const maxPrice = query.maxPrice||'1000000';
    const roomsMin = query.roosMin||'0';
    const bathsMin = query.bathsMin||'0';
    const sort = query.sort||'price-desc';
    const areaMax = query.areaMax||'35000';
    const locationExternalIDs = query.locationExternalIDs||'5002';
    const categoryExternalID = query.categoryExternalId||'4';

    const data = await fetchApi(`${baseUrl}/properties/list?locationExternalIDs=${locationExternalIDs}&purpose=${purpose}&categoryExternalID=${categoryExternalID}&bathsMin=${bathsMin}&rentFrequency=${rentFrequency}&priceMin=${minPrice}&priceMax=${maxPrice}&roomsMin=${roomsMin}&sort=${sort}&areaMax=${areaMax}`);

    return {
        props:{
            properties: data?.hits,
        },
    };
}
  
export default Search;