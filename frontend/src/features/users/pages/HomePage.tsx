import { CURRENT_USER_NAME } from '@/shared/lib/current-user';

function formatToday(): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

export function HomePage() {
  const firstName = CURRENT_USER_NAME.split(' ')[0];

  return (
    <div>
      <h1 className="text-[38px] font-bold leading-[52px] text-green">Home</h1>

      <div className="mt-4 rounded-[5px] bg-white p-8 shadow-card">
        <p className="text-[32px] font-bold leading-[44px] text-navy">
          Olá {firstName}!
        </p>
        <p className="text-[18px] font-semibold leading-[32px] text-navy">
          {formatToday()}
        </p>

        <div className="mt-10 flex flex-col items-center gap-8">
          <img
            src="/home-illustration.svg"
            alt="Ilustração de boas-vindas"
            className="h-auto w-full max-w-[320px]"
          />
          <div className="w-full max-w-md rounded-md border border-surface-border py-4 text-center text-[16px] font-extrabold leading-[22px] text-[#021B1A]">
            Bem-vindo ao WenLock!
          </div>
        </div>
      </div>
    </div>
  );
}
