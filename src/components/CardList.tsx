import {
  SimpleGrid,
  useDisclosure,
  Box,
  Image,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { onOpen, isOpen, onClose } = useDisclosure();

  const [image, setImage] = useState('');

  function openModal(currentImage: string): void {
    setImage(currentImage);
    onOpen();
  }

  return (
    <>
      <SimpleGrid flex="1" gap="2" minChildWidth="290px" align="flex-start">
        {cards.map(item => (
          <Box key={item.id}>
            <Box as="a" onClick={() => openModal(item.url)}>
              <Image src={item.url} alt={item.title} w="290px" h="192px" />
              <Text as="a" href={item.url}>
                Abrir original
              </Text>
            </Box>
            <VStack
              alignItems="flex-start"
              spacing="2"
              bg="#353431"
              w="290px"
              p="5"
            >
              <Heading size="lg" fontWeight="normal">
                {item.title}
              </Heading>
              <Text id={item.description}>{`${item.description}`}</Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      <ModalViewImage isOpen={isOpen} onClose={onClose} imgUrl={image} />
    </>
  );
}
