import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  // const formValidations = {
  //   image: {},
  //   title: {
  //     // TODO REQUIRED, MIN AND MAX LENGTH VALIDATIONS
  //   },
  //   description: {
  //     // TODO REQUIRED, MAX LENGTH VALIDATIONS
  //   },
  // };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (values: any) => {
      await api.post('api/images', values);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  // eslint-disable-next-line consistent-return
  const onSubmit = async (data): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        return null;
      }

      const { title, description } = data;

      await mutation.mutateAsync({
        url: imageUrl,
        title,
        description,
      });

      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setImageUrl('');
      reset();
      closeModal();
    }
  };

  const arrMimeTypes = ['image/png', 'image/jpeg', 'image/gif'];

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', {
            required: {
              value: true,
              message: 'Arquivo obrigatório',
            },
            validate: {
              lessThan10MB: (v: FileList) =>
                Number(v[0].size) > 10000000
                  ? 'O arquivo deve ser menor que 10MB'
                  : null,
              acceptedFormats: (v: FileList) =>
                !arrMimeTypes.some(mime => mime === v[0].type)
                  ? 'Somente são aceitos arquivos PNG, JPEG e GIF'
                  : null,
            },
          })}
          name="image"
          error={errors.image}
          // TODO SEND IMAGE ERRORS
          // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
        />

        <TextInput
          placeholder="Título da imagem..."
          {...register('title', {
            required: {
              value: true,
              message: 'Título obrigatório',
            },
            minLength: {
              value: 2,
              message: 'Mínimo de 2 caracteres',
            },
            maxLength: {
              value: 20,
              message: 'Máximo de 20 caracteres',
            },
          })}
          error={errors.title}
          // TODO SEND TITLE ERRORS
          // TODO REGISTER TITLE INPUT WITH VALIDATIONS
        />

        <TextInput
          placeholder="Descrição da imagem..."
          {...register('description', {
            required: {
              value: true,
              message: 'Descrição obrigatória',
            },
            maxLength: {
              value: 65,
              message: 'Máximo de 65 caracteres',
            },
          })}
          error={errors.description}
          // TODO SEND DESCRIPTION ERRORS
          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
