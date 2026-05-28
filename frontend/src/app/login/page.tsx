'use client'

// React
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Lib Design System
import { Button, Card, FlexContainer, InputMask, InputPassword, TextLink, Typography } from "@uigovpe/components";

// Form e Validações
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  cpf: z.string().min(1, { message: "CPF é obrigatório" }),
  senha: z.string().min(1, { message: "Senha é obrigatória" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      cpf: "",
      senha: ""
    }
  });

  const onSubmit = (data: LoginFormData) => {
    setIsLoading(true)
    console.log(data);
    
    // Realizar autenticação
    setTimeout(() => {
      setIsLoading(false)
      // router.push('/home')
    }, 2000);
  };

  return (
    <>
      <div className="p-8 md:p-12 max-w-md">
        <FlexContainer
          direction="row"
          gap="12"
          justify="center"
          align="center"
          className="mb-12 max-w-96"
        >
          <div>
            <Image
              src="/logos/logo-farmacia-digital.svg"
              width={200}
              height={100}
              alt="Farmácia Digital"
              className="responsive-img rounded"
            />
          </div>
          <div>
            <Image
              src="/logos/logo-secretaria.svg"
              width={200}
              height={100}
              alt="Secretaria de Educação e Esportes"
              className="contrast-img responsive-img rounded"
            />
          </div>
        </FlexContainer>

        <Card title="Login">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FlexContainer
              direction="col"
              gap="4"
              justify="center"
              align="start"
            >
              <div className="w-full">
                <Controller
                  name="cpf"
                  control={control}
                  render={({ field }) => (
                    <InputMask
                      {...field}
                      label="CPF"
                      placeholder="000.000.000-00"
                      mask="999.999.999-99"
                      invalid={!!errors.cpf}
                      supportText={errors.cpf?.message}
                    />
                  )}
                />
              </div>

              <div className="w-full">
                <Controller
                  name="senha"
                  control={control}
                  render={({ field }) => (
                    <InputPassword
                      {...field}
                      label="Senha"
                      placeholder="Digite sua senha"
                      invalid={!!errors.senha}
                      supportText={errors.senha?.message}
                      keyfilter={/^S+$/}
                    />
                  )}
                />
              </div>

              <Typography
                variant="div"
                size="small"
                className="w-full flex-1"
              >
                <TextLink onClick={() => router.push('/recover-password')}>
                  Esqueci a minha senha
                </TextLink>
              </Typography>

              <Button
                type="submit"
                label="Entrar"
                className="w-full"
                loading={isLoading}
              />

              <Typography
                variant="div"
                textAlign="center"
                className="w-full flex-1"
              >
                {'Não tem uma conta? '}
                <TextLink onClick={() => router.push('/register')}>
                  Cadastre-se
                </TextLink>
              </Typography>

            </FlexContainer>

          </form>
        </Card>
      </div>
    </>
  );
}
