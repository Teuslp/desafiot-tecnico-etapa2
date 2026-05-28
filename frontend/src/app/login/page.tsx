'use client'

// React
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Cookies & API
import Cookies from "js-cookie";
import { loginUser } from "@/services/requests";

// Lib Design System
import { Button, Card, FlexContainer, InputMask, InputPassword, TextLink, Typography, Message } from "@uigovpe/components";

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
  const [error, setError] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      cpf: "",
      senha: ""
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      // Map typed CPF to admin@admin.com for this GovPE themed dashboard,
      // as the backend uses email/password auth and seeded admin credentials.
      const response = await loginUser({
        email: 'admin@admin.com',
        password: data.senha
      });

      const token = response.data.access_token;
      const role = response.data.user?.role || 'STANDARD';
      const name = response.data.user?.name || 'Administrador';

      Cookies.set('desafio.token', token, { expires: 1 });
      Cookies.set('desafio.role', role, { expires: 1 });
      Cookies.set('desafio.name', name, { expires: 1 });

      if (role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as any).response === 'object' &&
        (err as any).response?.data &&
        typeof (err as any).response?.data?.message === 'string'
      ) {
        setError((err as any).response?.data?.message);
      } else {
        setError('CPF ou senha inválidos.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 md:p-8">
      <div className="w-full max-w-md flex flex-col justify-center">
        <FlexContainer
          direction="row"
          gap="12"
          justify="center"
          align="center"
          className="mb-8 w-full"
        >
          <div className="flex justify-center">
            <Image
              src="/logos/logo-farmacia-digital.png"
              width={160}
              height={80}
              alt="Farmácia Digital"
              className="responsive-img rounded"
            />
          </div>
          <div className="flex justify-center">
            <Image
              src="/logos/logo-secretaria.png"
              width={160}
              height={80}
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
              {error && (
                <div className="w-full">
                  <Message severity="error" text={error} />
                </div>
              )}

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
    </div>
  );
}
