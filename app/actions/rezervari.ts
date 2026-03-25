'use server';

import { supabase } from '@/lib/supabase';

export type RezervareData = {
  nume: string;
  email: string;
  telefon: string;
  numar_persoane: number;
  data_rezervare: string;
  ora_rezervare: string;
};

export async function salveazaRezervare(data: RezervareData) {
  const { error } = await supabase.from('rezervari').insert([
    {
      nume: data.nume,
      email: data.email,
      telefon: data.telefon,
      numar_persoane: data.numar_persoane,
      data_rezervare: data.data_rezervare,
      ora_rezervare: data.ora_rezervare,
      // status si created_at se genereaza automat
    },
  ]);

  if (error) {
    return { succes: false, mesaj: error.message };
  }

  return { succes: true, mesaj: 'Rezervarea a fost salvata cu succes!' };
}

export async function getRezervarile() {
  const { data, error } = await supabase
    .from('rezervari')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { succes: false, date: null, mesaj: error.message };
  }

  return { succes: true, date: data, mesaj: '' };
}

export type StatusRezervare = 'in asteptare' | 'confirmat' | 'respins';

export async function schimbaStatus(id: string, status: StatusRezervare) {
  const { error } = await supabase
    .from('rezervari')
    .update({ status })
    .eq('id', id);

  if (error) {
    return { succes: false, mesaj: error.message };
  }

  return { succes: true, mesaj: `Rezervarea a fost marcata ca "${status}".` };
}

export async function stergeRezervare(id: string) {
  const { error } = await supabase
    .from('rezervari')
    .delete()
    .eq('id', id);

  if (error) {
    return { succes: false, mesaj: error.message };
  }

  return { succes: true, mesaj: 'Rezervarea a fost stearsa.' };
}
