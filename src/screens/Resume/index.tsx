import React, { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, ActivityIndicator } from "react-native";
import { addMonths, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { VictoryPie } from "victory-native";
import { useTheme } from "styled-components";
import { HistoryCard } from "../../components/HistoryCard";
import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelectIcon,
  MonthSelect,
  MonthSelectButton,
  Month,
  LoadContainer,
} from "./styles";
import { categories } from "../../utils/categories";
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth } from "../../hooks/auth";

interface TransactionData {
  type: "up" | "down";
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  key: string;
  percentage: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    []
  );

  const { user } = useAuth();

  const theme = useTheme();

  function handleDateChange(action: "next" | "prev") {
    if (action === "next") {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    setIsLoading(true);
    const dataKey = `@gofinances:transactions_:${user.id}`;

    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted: TransactionData[] = response
      ? JSON.parse(response)
      : [];

    const expensives: TransactionData[] = responseFormatted.filter(
      (expensive: TransactionData) =>
        expensive.type === "down" &&
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
    );

    const expensivesTotal = expensives.reduce(
      (acumulator: number, expensive: TransactionData) => {
        return acumulator + Number(expensive.amount);
      },
      0
    );

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expensives.forEach((expensive) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const percentage = `${((categorySum / expensivesTotal) * 100).toFixed(
          0
        )}%`;

        totalByCategory.push({
          name: category.name,
          total: categorySum,
          color: category.color,
          key: category.key,
          totalFormatted,
          percentage,
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: useBottomTabBarHeight(),
            }}
          >
            <MonthSelect>
              <MonthSelectButton onPress={() => handleDateChange("prev")}>
                <MonthSelectIcon name="chevron-left" />
              </MonthSelectButton>

              <Month>
                {format(selectedDate, "MMMM, yyyy", { locale: ptBR })}
              </Month>

              <MonthSelectButton onPress={() => handleDateChange("next")}>
                <MonthSelectIcon name="chevron-right" />
              </MonthSelectButton>
            </MonthSelect>

            <ChartContainer>
              <VictoryPie
                data={totalByCategories}
                x="percentage"
                y="total"
                colorScale={totalByCategories.map((category) => category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: "bold",
                    fill: theme.colors.shape,
                  },
                }}
                labelRadius={110}
              />
            </ChartContainer>
            {totalByCategories.map((item) => (
              <HistoryCard
                key={item.key}
                title={item.name}
                amount={item.totalFormatted}
                color={item.color}
              />
            ))}
          </Content>
        </>
      )}
    </Container>
  );
}
